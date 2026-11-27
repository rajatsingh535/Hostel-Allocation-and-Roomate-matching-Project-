"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
  : "http://localhost:5000/api";

// In-memory Stale-While-Revalidate (SWR) cache for client-side performance optimization
const memoryCache = new Map();
const DEFAULT_TTL_MS = 30000;

/**
 * Reusable Data-Fetching & Caching Hook (Week 13 Scalability & Performance)
 * Provides automatic stale-while-revalidate caching, request cancellation,
 * latency measurement, and graceful fallback when offline.
 */
export function useHostelApi(endpoint, { fallbackData = null, ttl = DEFAULT_TTL_MS, immediate = true } = {}) {
  const cacheKey = `${API_BASE}${endpoint}`;
  const cached = memoryCache.get(cacheKey);

  const [data, setData] = useState(cached ? cached.data : fallbackData);
  const [loading, setLoading] = useState(!cached && immediate);
  const [error, setError] = useState(null);
  const [latencyMs, setLatencyMs] = useState(cached ? cached.latencyMs : null);
  const abortRef = useRef(null);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const hit = memoryCache.get(cacheKey);
      if (!forceRefresh && hit && now - hit.timestamp < ttl) {
        setData(hit.data);
        setLatencyMs(hit.latencyMs);
        setLoading(false);
        return hit.data;
      }

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      const t0 = performance.now();

      try {
        const res = await fetch(cacheKey, { signal: controller.signal });
        const json = await res.json();
        const elapsed = Math.round(performance.now() - t0);
        setLatencyMs(elapsed);

        if (res.ok && json.success !== false) {
          const payload = json.data !== undefined ? json.data : json;
          memoryCache.set(cacheKey, { data: payload, timestamp: Date.now(), latencyMs: elapsed });
          setData(payload);
          setLoading(false);
          return payload;
        } else {
          throw new Error(json.message || `HTTP ${res.status}`);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
        if (fallbackData !== null && data === null) {
          setData(fallbackData);
        }
        setLoading(false);
        return fallbackData;
      }
    },
    [cacheKey, ttl, fallbackData, data]
  );

  useEffect(() => {
    if (immediate) fetchData(false);
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [immediate, fetchData]);

  return { data, loading, error, latencyMs, refetch: () => fetchData(true) };
}
