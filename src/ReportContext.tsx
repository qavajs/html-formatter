import { createContext, ReactNode, useContext } from 'react';
import type { Report } from './types';

const ReportContext = createContext<Report | null>(null);

export const ReportProvider = ({ report, children }: { report: Report, children: ReactNode }) =>
    <ReportContext.Provider value={report}>{children}</ReportContext.Provider>;

export function useReport(): Report {
    const report = useContext(ReportContext);
    if (!report) throw new Error('useReport must be used inside ReportProvider');
    return report;
}
