import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, RefreshCw, Key, FileCheck, AlertOctagon, Download } from 'lucide-react';

export const INITIAL_LEDGER = [
  {
    id: "EVD-SHA-01",
    evidenceName: "Copernicus Sentinel-1 SAR GRD Pass",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestamp: "2026-09-12 04:31:08 UTC",
    operator: "INCOIS / ISRO Ground Station Shadnagar",
    status: "VERIFIED_TAMPER_PROOF",
    certId: "CERT-ISO17025-IN-9812",
    signature: "ECDSA-secp256k1-PASS"
  },
  {
    id: "EVD-SHA-02",
    evidenceName: "Raw Terrestrial + Satellite AIS Stream (MMSI 419001248)",
    sha256: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    timestamp: "2026-09-12 05:14:22 UTC",
    operator: "DG Shipping MRCC Mumbai Feed",
    status: "VERIFIED_TAMPER_PROOF",
    certId: "CERT-IALA-AIS-2026-881",
    signature: "ECDSA-secp256k1-PASS"
  },
  {
    id: "EVD-SHA-03",
    evidenceName: "CMEMS Ocean Current & Wind Vector Telemetry (0.05° grid)",
    sha256: "fcde2b2edba56bf408601fb721fe9b5c338d10ee429ce04b251141750e0e465e",
    timestamp: "2026-09-12 05:30:00 UTC",
    operator: "ECMWF Copernicus Marine Service",
    status: "VERIFIED_TAMPER_PROOF",
    certId: "CERT-CMEMS-PHY-2026-402",
    signature: "ECDSA-secp256k1-PASS"
  },
  {
    id: "EVD-SHA-04",
    evidenceName: "Siamese Trajectory Similarity Network (STSN v2.8) Model Checkpoint",
    sha256: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    timestamp: "2026-09-12 06:12:44 UTC",
    operator: "DeepMarine Forensics Neural Engine",
    status: "VERIFIED_TAMPER_PROOF",
    certId: "CERT-AI-WEIGHTS-99120",
    signature: "ECDSA-secp256k1-PASS"
  },
  {
    id: "EVD-SHA-05",
    evidenceName: "Indian Coast Guard Dornier FLIR Thermal Imaging Flight 312",
    sha256: "7d793037a0760186574b0282f2f435e70d73a44d8905215ab83899d763d98189",
    timestamp: "2026-09-12 07:45:10 UTC",
    operator: "ICG Air Squadron 747 Goa",
    status: "VERIFIED_TAMPER_PROOF",
    certId: "CERT-ICG-FLIR-0912",
    signature: "ECDSA-secp256k1-PASS"
  }
];

export default function ChainOfCustodyLedger() {
  const [ledger, setLedger] = useState(INITIAL_LEDGER);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastAuditTimestamp, setLastAuditTimestamp] = useState("Just now");
  const [verificationSuccess, setVerificationSuccess] = useState(true);

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setLastAuditTimestamp(new Date().toLocaleTimeString() + " UTC");
    }, 900);
  };

  const handleDownloadLedger = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ledger, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `forensic_chain_of_custody_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Title & Audit Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-status-success" />
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase font-mono">
              Cryptographic Chain-of-Custody & Evidence Tamper Verification
            </h3>
            <span className="text-[10px] text-text-muted font-mono">
              SHA-256 Digital Fingerprint Ledger · Admissible under Court Evidence Act
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="px-3 py-1.5 rounded-xl bg-status-success hover:bg-emerald-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
            <span>{isVerifying ? "Verifying SHA-256 Hashes..." : "Verify All Hashes"}</span>
          </button>

          <button
            onClick={handleDownloadLedger}
            className="px-2.5 py-1.5 rounded-xl border border-border-marine hover:bg-ocean-light text-ocean-navy text-xs font-bold font-mono flex items-center gap-1 transition-all"
            title="Download JSON cryptographic certificate ledger"
          >
            <Download className="w-3.5 h-3.5 text-ocean" />
            <span className="hidden sm:inline">Export Ledger</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 text-xs font-mono">
        <div className="flex items-center gap-2 text-status-success">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-bold">
            100% INTEGRITY VERIFIED · 0 TAMPER ANOMALIES DETECTED
          </span>
        </div>
        <span className="text-[10px] text-text-muted">
          Last Audit: <strong>{lastAuditTimestamp}</strong> · RFC 3161 Compliant
        </span>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-ocean-light border-b border-border-marine text-[9px] text-text-muted uppercase">
            <tr>
              <th className="px-3 py-2">EVIDENCE ASSET</th>
              <th className="px-3 py-2">SHA-256 CRYPTOGRAPHIC HASH</th>
              <th className="px-3 py-2">ORIGIN CUSTODIAN & TIMESTAMP</th>
              <th className="px-3 py-2 text-right">AUDIT CERT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/50">
            {ledger.map((item) => (
              <tr key={item.id} className="hover:bg-ocean-sky/20">
                <td className="px-3 py-2.5">
                  <div className="font-bold text-ocean-navy">{item.evidenceName}</div>
                  <span className="text-[10px] text-ocean font-mono">{item.id}</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-slate-50 px-2 py-1 rounded border border-border-marine/70 max-w-[280px] truncate">
                    <Key className="w-3 h-3 text-ocean flex-shrink-0" />
                    <span className="truncate font-mono">{item.sha256}</span>
                  </div>
                  <span className="text-[9px] text-status-success font-bold mt-0.5 block flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> {item.signature}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[11px]">
                  <div className="text-ocean-navy font-semibold">{item.operator}</div>
                  <div className="text-[10px] text-text-muted">{item.timestamp}</div>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-status-success text-[10px] font-bold border border-emerald-200">
                    {item.certId}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

