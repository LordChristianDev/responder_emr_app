import { createContext, useContext, type ReactNode } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const useCaseHook = () => {
	const [caseNumber, setCaseNumber] = usePersistedState<string>("caseNumber", "");

	return { caseNumber, setCaseNumber };
}

export const CaseProvider = ({ children }: CaseProviderProps) => {
	const caseData = useCaseHook();

	return (
		<CaseContext.Provider value={caseData} >
			{children}
		</CaseContext.Provider>
	);
}

export const useCase = (): CaseContextType => {
	const context = useContext(CaseContext);

	if (context === undefined) {
		throw new Error('useCase must be used within an CaseProvider');
	}
	return context;
}

type CaseContextType = {
	caseNumber: string;
	setCaseNumber: React.Dispatch<React.SetStateAction<string>>;
}

type CaseProviderProps = {
	children: ReactNode;
}