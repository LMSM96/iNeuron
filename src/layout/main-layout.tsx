import { useEffect, useState, createContext } from 'react';
import { getStockMarketDetails } from '@/services/stock-market';

export const StockMarketDetailContext = createContext<ScanItem[]>([]);

export interface ValueVariable {
    type: "value";
    values: number[];
};

export interface IndicatorVariable {
    type: "indicator";
    study_type: "cci" | "rsi";
    parameter_name: string;
    default_value: number;
    max_value: number;
    min_value: number;
};

export type VariableItem = ValueVariable | IndicatorVariable;

export type ScanCriteriaItem = {
    text: string;
    type: "plain_text" | "variable";
    variable?: Record<string, VariableItem>;
};

export type ScanItem = {
    id: number;
    name: string;
    tag: string;
    color: string;
    criteria: ScanCriteriaItem[];
};

export default function MainLayout({ children }: { children: React.ReactElement }) {
    const [stockMarketDetails, setStockMarketDetails] = useState<ScanItem[]>([]);

    useEffect(() => {
        getStockMarketDetails()
            // .then(res => res.json())
            .then(data => {
                // console.log("stock market details.", data);
                setStockMarketDetails(data.data);
            })
            .catch((err) => console.log(`Fetching stack market details failed. Error:- ${err}`));
    }, []);

    return (
        <StockMarketDetailContext.Provider value={stockMarketDetails} >
            {children}
        </StockMarketDetailContext.Provider>
    );
}