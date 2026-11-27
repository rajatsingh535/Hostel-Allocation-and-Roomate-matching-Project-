/**
 * WEEK 13 FINAL EVALUATION — AUTOMATED PRODUCT READINESS & EDGE-CASE TEST SUITE (45 MARKS)
 * Verifies all Week 13 pending tasks, security guards, operational telemetry,
 * QR Allotment Pass, Floor Occupancy Heatmap, CSV Report Export, and Room Swap edge cases.
 */

const BASE_URL = "http://localhost:5000/api";

async function request(method, path, body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text();
  return { status: res.status, headers: res.headers, data };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runWeek13Tests() {
  console.log("================================================================================");
  console.log("LPU HOSTEL ALLOCATION & ROOMMATE MATCHING — WEEK 13 FINAL EVALUATION (45 MARKS)");
  console.log("================================================================================\n");

  // 1. Operational Health, Telemetry & Performance Headers
  console.log("--- [1] Deployment, Health Monitoring & Performance Telemetry ---");
  const metricsRes = await request("GET", "/health/metrics");
  assert(
    metricsRes.status === 200 && metricsRes.data.success === true,
    `GET /api/health/metrics returned status=${metricsRes.data.data?.status} (avgLatency=${metricsRes.data.data?.performance?.avgLatencyMs}ms)`
  );
  const responseTimeHeader = metricsRes.headers.get("x-response-time");
  assert(
    Boolean(responseTimeHeader),
    `Performance Profiler Header present: X-Response-Time = ${responseTimeHeader}`
  );

  // 2. Defensive Security Headers & NoSQL / XSS Sanitizer
  console.log("\n--- [2] Security Headers & NoSQL/XSS Payload Sanitization ---");
  const xFrame = metricsRes.headers.get("x-frame-options");
  const xContent = metricsRes.headers.get("x-content-type-options");
  assert(
    xFrame === "DENY" && xContent === "nosniff",
    `Defensive HTTP Security Headers verified (X-Frame-Options=${xFrame}, X-Content-Type-Options=${xContent})`
  );

  // Send malicious NoSQL operator & XSS payload to login
  const maliciousLogin = await request("POST", "/auth/login", {
    rollNumber: "12304567",
    password: "password123",
    $where: "this.passwordHash.length > 0",
    injectedScript: "<script>alert('xss')</script>",
  });
  assert(
    maliciousLogin.status === 200 && maliciousLogin.data.token,
    "NoSQL ($where) & XSS (<script>) payload sanitized safely without crashing authentication"
  );

  // 3. Official Digital Hostel Allotment Letter & Cryptographic QR Pass
  console.log("\n--- [3] Week 13 Milestone: Digital Hostel Allotment Pass & QR Verification ---");
  const passRes = await request("GET", "/applications/12304567/allotment-pass");
  assert(
    passRes.status === 200 &&
      passRes.data.success === true &&
      passRes.data.data.verificationToken.startsWith("LPU-QR-2026-"),
    `Generated Digital Allotment Pass (${passRes.data.data?.passNumber}) with QR Token (${passRes.data.data?.verificationToken}) & Fee Receipt (${passRes.data.data?.feeReceipt?.receiptNumber})`
  );

  // 4. Warden Floor-Wise Occupancy Heatmap
  console.log("\n--- [4] Week 13 Milestone: Warden Floor-Wise Occupancy Heatmap ---");
  const heatmapRes = await request("GET", "/stats/heatmap");
  assert(
    heatmapRes.status === 200 &&
      heatmapRes.data.success === true &&
      heatmapRes.data.data.length >= 12 &&
      heatmapRes.data.data[0].floors.length === 6,
    `GET /api/stats/heatmap returned 6-floor occupancy matrix across ${heatmapRes.data.data.length} LPU Hostels`
  );

  // 5. Warden 1-Click CSV Report Export
  console.log("\n--- [5] Week 13 Milestone: Exportable CSV Allocation Report ---");
  const csvRes = await request("GET", "/stats/export-csv?format=json");
  assert(
    csvRes.status === 200 &&
      csvRes.data.success === true &&
      csvRes.data.csv.includes('"Application ID","Roll Number"'),
    `GET /api/stats/export-csv generated ${csvRes.data.filename} (${csvRes.data.rowCount} application rows)`
  );

  // 6. Edge Case 1: Block Self-Room-Swap
  console.log("\n--- [6] Security & Edge Cases: Self-Swap & Cross-Gender Room Swap Blocks ---");
  const selfSwapRes = await request("POST", "/room-swaps", {
    requestedByName: "Arjun Sharma",
    requestedByRoll: "12304567",
    requestedByGender: "Male",
    currentHostel: "BH-1",
    currentRoom: "101",
    targetStudentRoll: "12304567",
    reason: "Attempting to swap with myself",
  });
  assert(
    selfSwapRes.status === 400 && selfSwapRes.data.code === "SELF_SWAP_FORBIDDEN",
    `Self-Room-Swap correctly blocked with HTTP 400 (${selfSwapRes.data.code})`
  );

  // 7. Edge Case 2: Block Cross-Gender Room Swap
  const crossGenderSwapRes = await request("POST", "/room-swaps", {
    requestedByName: "Arjun Sharma",
    requestedByRoll: "12304567",
    requestedByGender: "Male",
    currentHostel: "GH-1",
    currentRoom: "101",
    targetStudentRoll: "12304568",
    reason: "Male student attempting swap into Girls Hostel GH-1",
  });
  assert(
    crossGenderSwapRes.status === 400 && crossGenderSwapRes.data.code === "CROSS_GENDER_SWAP_FORBIDDEN",
    `Cross-Gender Room Swap correctly blocked with HTTP 400 (${crossGenderSwapRes.data.code})`
  );

  // 8. Valid Mutual Room Swap Request & Chief Warden Approval Workflow
  console.log("\n--- [7] Week 13 Milestone: Mutual Roommate Swap & Warden Approval Workflow ---");
  const swapRoll = `1239${Math.floor(1000 + Math.random() * 8999)}`;
  const validSwapRes = await request("POST", "/room-swaps", {
    requestedByName: "Rahul Verma",
    requestedByRoll: swapRoll,
    requestedByGender: "Male",
    currentHostel: "BH-1",
    currentRoom: "101",
    currentBedNumber: "1",
    targetStudentRoll: "12345682",
    targetHostel: "BH-1",
    reason: "Mutual study partner room swap in BH-1",
  });
  assert(
    validSwapRes.status === 201 && validSwapRes.data.success === true,
    `Created valid Room Swap Request (#${validSwapRes.data.data?._id}) with status=PENDING`
  );

  const approveSwapRes = await request("PUT", `/room-swaps/${validSwapRes.data.data._id}/status`, {
    status: "APPROVED",
    adminNotes: "Verified same-wing eligibility and approved by Chief Warden",
  });
  assert(
    approveSwapRes.status === 200 && approveSwapRes.data.data.status === "APPROVED",
    `Chief Warden approved Room Swap Request -> status=${approveSwapRes.data.data.status}`
  );

  console.log("\n================================================================================");
  console.log("🎉 ALL WEEK 13 PRODUCT READINESS, SECURITY, MONITORING & MILESTONE TESTS PASSED!");
  console.log("================================================================================");
}

runWeek13Tests().catch((err) => {
  console.error("Unexpected Week 13 test runner error:", err);
  process.exit(1);
});
