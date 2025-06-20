import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  eligibility: string[];
  requiredDocuments: string[];
  benefits: string;
  applicationProcess: string;
  applyLink: string;
  department: string;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applicantCount?: number;
}

interface SchemesContextType {
  schemes: Scheme[];
  addScheme: (scheme: Omit<Scheme, "id" | "createdAt" | "updatedAt">) => string;
  updateScheme: (id: string, updates: Partial<Scheme>) => void;
  deleteScheme: (id: string) => boolean;
  getSchemeById: (id: string) => Scheme | undefined;
  getSchemesByCategory: (category: string) => Scheme[];
  searchSchemes: (query: string) => Scheme[];
  toggleSchemeStatus: (id: string) => void;
}

const SchemesContext = createContext<SchemesContextType | undefined>(undefined);

export const useSchemes = () => {
  const context = useContext(SchemesContext);
  if (!context) {
    throw new Error("useSchemes must be used within a SchemesProvider");
  }
  return context;
};

const mockSchemes: Scheme[] = [
  {
    id: "SCHEME001",
    name: "Rythu Bandhu",
    description: "Financial assistance to farmers for agricultural activities",
    category: "Agriculture",
    eligibility: [
      "Must be a farmer with valid land records",
      "Should be a resident of Telangana",
      "Land holding should be in farmer's name",
    ],
    requiredDocuments: [
      "Land Revenue Records (Pahani/Title Deeds)",
      "Aadhaar Card",
      "Bank Account Details",
      "Passport Size Photos",
    ],
    benefits: "₹10,000 per acre per season for crop investment",
    applicationProcess:
      "Apply online through TS Land Records portal or visit Village Revenue Officer",
    applyLink: "https://webland.telangana.gov.in/",
    department: "Agriculture Department",
    validUntil: "2024-12-31",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    applicantCount: 25000,
  },
  {
    id: "SCHEME002",
    name: "KCR Kit",
    description: "Comprehensive support for pregnant women and newborns",
    category: "Health",
    eligibility: [
      "Pregnant women registered in government hospitals",
      "Must be a resident of Telangana",
      "Should have regular antenatal checkups",
    ],
    requiredDocuments: [
      "Pregnancy Registration Card",
      "Aadhaar Card",
      "Ration Card",
      "Medical Records",
    ],
    benefits:
      "Free kit containing baby clothes, medicines, and nutritional supplements worth ₹12,000",
    applicationProcess: "Register at any government hospital during pregnancy",
    applyLink: "https://health.telangana.gov.in/",
    department: "Health Department",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    applicantCount: 15000,
  },
  {
    id: "SCHEME003",
    name: "Dalit Bandhu",
    description: "Financial empowerment scheme for Dalit families",
    category: "Social Welfare",
    eligibility: [
      "Must belong to Scheduled Caste (SC) community",
      "Age between 18-55 years",
      "Annual family income less than ₹5 lakhs",
      "One person per family eligible",
    ],
    requiredDocuments: [
      "Caste Certificate",
      "Income Certificate",
      "Aadhaar Card",
      "Bank Account Details",
      "Business Plan (if applicable)",
    ],
    benefits: "₹10 lakh financial assistance for business/skill development",
    applicationProcess:
      "Apply through District Collector office or online portal",
    applyLink: "https://dalitbandhu.telangana.gov.in/",
    department: "SC Development Department",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    applicantCount: 8000,
  },
  {
    id: "SCHEME004",
    name: "Kalyana Lakshmi",
    description:
      "Financial assistance for marriages of SC/ST/BC/Minority girls",
    category: "Social Welfare",
    eligibility: [
      "Bride must belong to SC/ST/BC/Minority community",
      "Annual family income less than ₹2 lakhs",
      "Age of bride should be 18+ years",
      "Groom's age should be 21+ years",
    ],
    requiredDocuments: [
      "Caste Certificate",
      "Income Certificate",
      "Age Proof Certificates",
      "Marriage Invitation Card",
      "Bank Account Details",
    ],
    benefits: "₹1.16 lakh financial assistance for marriage expenses",
    applicationProcess: "Apply through VRO/Ward Secretary or online portal",
    applyLink: "https://kalyanam.telangana.gov.in/",
    department: "Welfare Department",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    applicantCount: 12000,
  },
];

export const SchemesProvider = ({ children }: { children: ReactNode }) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  // Load schemes from localStorage on mount
  useEffect(() => {
    const savedSchemes = localStorage.getItem("tg-civic-schemes");
    if (savedSchemes) {
      try {
        setSchemes(JSON.parse(savedSchemes));
      } catch (error) {
        console.error("Error loading schemes from localStorage:", error);
        setSchemes(mockSchemes);
      }
    } else {
      setSchemes(mockSchemes);
    }
  }, []);

  // Save schemes to localStorage whenever schemes change
  useEffect(() => {
    localStorage.setItem("tg-civic-schemes", JSON.stringify(schemes));
  }, [schemes]);

  const generateSchemeId = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, "0");
    return `SCHEME${year}${randomNum}`;
  };

  const addScheme = (
    schemeData: Omit<Scheme, "id" | "createdAt" | "updatedAt">,
  ): string => {
    const id = generateSchemeId();
    const now = new Date().toISOString();

    const newScheme: Scheme = {
      ...schemeData,
      id,
      createdAt: now,
      updatedAt: now,
      applicantCount: 0,
    };

    setSchemes((prev) => [newScheme, ...prev]);
    return id;
  };

  const updateScheme = (id: string, updates: Partial<Scheme>) => {
    setSchemes((prev) =>
      prev.map((scheme) =>
        scheme.id === id
          ? { ...scheme, ...updates, updatedAt: new Date().toISOString() }
          : scheme,
      ),
    );
  };

  const deleteScheme = (id: string): boolean => {
    const schemeExists = schemes.some((scheme) => scheme.id === id);
    if (schemeExists) {
      setSchemes((prev) => prev.filter((scheme) => scheme.id !== id));
      return true;
    }
    return false;
  };

  const getSchemeById = (id: string): Scheme | undefined => {
    return schemes.find((scheme) => scheme.id === id);
  };

  const getSchemesByCategory = (category: string): Scheme[] => {
    return schemes.filter(
      (scheme) =>
        scheme.category.toLowerCase() === category.toLowerCase() &&
        scheme.isActive,
    );
  };

  const searchSchemes = (query: string): Scheme[] => {
    const searchTerm = query.toLowerCase();
    return schemes.filter(
      (scheme) =>
        (scheme.name.toLowerCase().includes(searchTerm) ||
          scheme.description.toLowerCase().includes(searchTerm) ||
          scheme.category.toLowerCase().includes(searchTerm) ||
          scheme.benefits.toLowerCase().includes(searchTerm)) &&
        scheme.isActive,
    );
  };

  const toggleSchemeStatus = (id: string) => {
    setSchemes((prev) =>
      prev.map((scheme) =>
        scheme.id === id
          ? {
              ...scheme,
              isActive: !scheme.isActive,
              updatedAt: new Date().toISOString(),
            }
          : scheme,
      ),
    );
  };

  const value: SchemesContextType = {
    schemes,
    addScheme,
    updateScheme,
    deleteScheme,
    getSchemeById,
    getSchemesByCategory,
    searchSchemes,
    toggleSchemeStatus,
  };

  return (
    <SchemesContext.Provider value={value}>{children}</SchemesContext.Provider>
  );
};
