import { usePermissionsCtx } from "@/ctx/permissions";
import { User } from "./types";

interface Props {
  selectedUser: User;
}
export const PermissionsModal = ({ selectedUser }: Props) => {
  const { setPermission, withPermission, handleCloseModal } =
    usePermissionsCtx();
  // const {handleCloseModal} = useChatRoom()

  return (
    <div
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        position: "fixed",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <div
        style={{
          backgroundColor: "tomato",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #334155",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <h3
          style={{
            color: "#f1f5f9",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Decryption Permissions for {selectedUser.name}
        </h3>
        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "0.875rem",
          }}
        >
          Control whether {selectedUser.name} can decrypt your future messages
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={setPermission(selectedUser.id, true)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: withPermission(selectedUser.id)
                ? "#10b981"
                : "#374151",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ✅ Allow Decryption
          </button>
          <button
            onClick={() => setPermission(selectedUser.id, false)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: !withPermission(selectedUser.id)
                ? "#ef4444"
                : "#374151",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            🚫 Block Decryption
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#0f172a",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontSize: "0.75rem",
            color: "#94a3b8",
          }}
        >
          <strong>Note:</strong> This only affects your future messages. Past
          messages remain unchanged.
          {selectedUser.name} will not see messages you send when blocked.
        </div>

        <button
          onClick={handleCloseModal}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#475569",
            color: "#f1f5f9",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
