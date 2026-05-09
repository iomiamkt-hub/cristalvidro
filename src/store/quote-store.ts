import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ProductType,
  GlassType,
  ThicknessOption,
  ProfileType,
  InstallationType,
  ProductSubtype,
} from "@/lib/pricing";

export type Step = "product" | "dimensions" | "glass" | "extras" | "summary" | "contact";

export interface QuoteState {
  currentStep: Step;
  product: ProductType | null;
  subtype: ProductSubtype | null;
  width: number;
  height: number;
  glassType: GlassType;
  thickness: ThicknessOption;
  profile: ProfileType;
  installation: InstallationType;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hasHydrated: boolean;

  setStep: (step: Step) => void;
  setProduct: (product: ProductType) => void;
  setSubtype: (subtype: ProductSubtype) => void;
  setDimensions: (width: number, height: number) => void;
  setGlassType: (type: GlassType) => void;
  setThickness: (t: ThicknessOption) => void;
  setProfile: (p: ProfileType) => void;
  setInstallation: (i: InstallationType) => void;
  setQuantity: (q: number) => void;
  setCustomer: (name: string, phone: string, email: string) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setHasHydrated: (v: boolean) => void;
}

const STEP_ORDER: Step[] = ["product", "dimensions", "glass", "extras", "summary", "contact"];

const initialState = {
  currentStep: "product" as Step,
  product: null,
  subtype: null,
  width: 90,
  height: 200,
  glassType: "temperado" as GlassType,
  thickness: 8 as ThicknessOption,
  profile: "inox" as ProfileType,
  installation: "frameless" as InstallationType,
  quantity: 1,
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  hasHydrated: false,
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),
      setProduct: (product) => set({ product, subtype: null }),
      setSubtype: (subtype) => set({ subtype }),
      setDimensions: (width, height) => set({ width, height }),
      setGlassType: (glassType) => set({ glassType }),
      setThickness: (thickness) => set({ thickness }),
      setProfile: (profile) => set({ profile }),
      setInstallation: (installation) => set({ installation }),
      setQuantity: (quantity) => set({ quantity }),
      setCustomer: (customerName, customerPhone, customerEmail) =>
        set({ customerName, customerPhone, customerEmail }),
      reset: () => set({ ...initialState, hasHydrated: true }),
      setHasHydrated: (v) => set({ hasHydrated: v }),

      nextStep: () => {
        const { currentStep } = get();
        const idx = STEP_ORDER.indexOf(currentStep);
        if (idx < STEP_ORDER.length - 1) set({ currentStep: STEP_ORDER[idx + 1] });
      },

      prevStep: () => {
        const { currentStep } = get();
        const idx = STEP_ORDER.indexOf(currentStep);
        if (idx > 0) set({ currentStep: STEP_ORDER[idx - 1] });
      },
    }),
    {
      name: "cristalvidro-quote",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        product: state.product,
        subtype: state.subtype,
        width: state.width,
        height: state.height,
        glassType: state.glassType,
        thickness: state.thickness,
        profile: state.profile,
        installation: state.installation,
        quantity: state.quantity,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        customerEmail: state.customerEmail,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const STEP_ORDER_CONST = STEP_ORDER;
