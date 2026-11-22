
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import AuthModal from "./AuthModal";

type AuthMode = "login" | "register";

type AuthModalContextType = {
  openAuthModal: (mode: AuthMode, next?: string) => void;
  closeAuthModal: () => void;
  nextPath: string;
};

const AuthModalContext = createContext<AuthModalContextType | null>(
  null
);

// One shared popup for the entire website.
export function AuthModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  // Store the destination requested before opening the popup.
  const [nextPath, setNextPath] = useState("/");

  const openAuthModal = useCallback(
    (selectedMode: AuthMode, next = "/") => {
      // Allow only internal destinations.
      const safePath =
        next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/";

      setMode(selectedMode);
      setNextPath(safePath);
      setIsOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{ openAuthModal, closeAuthModal, nextPath }}
    >
      {children}

      <AuthModal
        isOpen={isOpen}
        mode={mode}
        onClose={closeAuthModal}
        onSwitchMode={setMode}
      />
    </AuthModalContext.Provider>
  );
}

// Components use this hook to open the shared popup.
export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error(
      "useAuthModal must be used inside AuthModalProvider"
    );
  }

  return context;
}
