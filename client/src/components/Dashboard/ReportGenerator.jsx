"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FileDown, FileSpreadsheet, FileText, CheckCircle, Download, Database, Users, Calendar } from "lucide-react";
import { fetchBatches } from "@/redux/slices/hierarchySlice";
import { fetchAttendanceReport, fetchFacultyWorkloadReport } from "@/redux/slices/reportSlice";
import { addToast } from "@/redux/slices/uiSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";

export default function ReportGenerator({ onClose }) {
    const [reportType, setReportType] = useState(null); // 'attendance' or 'workload'
    const { batches } = useSelector(state => state.hierarchy);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchBatches());
        }
    }, [userInfo, dispatch]);

    const exportToExcel = async (data, title) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title);

        if (data.length === 0) return;

        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Add rows
        data.forEach(item => {
            worksheet.addRow(Object.values(item));
        });

        // Style headers
        worksheet.getRow(1).font = { bold: true };
        
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.xlsx`;
        a.click();
    };

    const exportToPDF = (data, title) => {
        const doc = new jsPDF();
        doc.text(title, 14, 15);
        
        if (data.length === 0) return;

        const headers = [Object.keys(data[0])];
        const body = data.map(item => Object.values(item));

        doc.autoTable({
            startY: 20,
            head: headers,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [6, 182, 212] } // Teal-500
        });

        doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.pdf`);
    };

    const handleGenerate = async (format) => {
        if (reportType === 'attendance' && !selectedBatch) {
            dispatch(addToast({ type: 'error', message: 'Please select a batch first' }));
            return;
        }

        setIsGenerating(true);
        try {
            let resultAction;
            let title = "";

            if (reportType === 'attendance') {
                resultAction = await dispatch(fetchAttendanceReport(selectedBatch));
                const batchName = batches.find(b => b._id === selectedBatch)?.name || "";
                title = `Attendance Report - ${batchName}`;
            } else {
                resultAction = await dispatch(fetchFacultyWorkloadReport());
                title = "Faculty Workload Report";
            }

            if (resultAction.payload) {
                const data = resultAction.payload;
                if (format === 'excel') {
                    await exportToExcel(data, title);
                } else {
                    exportToPDF(data, title);
                }
                dispatch(addToast({ type: 'success', message: 'Report generated successfully!' }));
            } else {
                dispatch(addToast({ type: 'error', message: 'Failed to generate report' }));
            }
        } catch (err) {
            dispatch(addToast({ type: 'error', message: 'Failed to generate report' }));
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                    <FileDown className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic">Report Engine</h2>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1 italic">Administrative Export Tool</p>
                </div>
            </div>

            {!reportType ? (
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setReportType('attendance')}
                        className="p-8 bg-slate-800 border-2 border-slate-700 rounded-3xl flex flex-col items-center hover:border-teal-500 transition-all group"
                    >
                        <Users className="w-10 h-10 text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-white uppercase text-xs">Attendance</span>
                        <span className="text-[10px] text-slate-500 mt-2 font-medium">Batch-wise stats</span>
                    </button>
                    <button 
                        onClick={() => setReportType('workload')}
                        className="p-8 bg-slate-800 border-2 border-slate-700 rounded-3xl flex flex-col items-center hover:border-blue-500 transition-all group"
                    >
                        <Calendar className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-white uppercase text-xs">Workload</span>
                        <span className="text-[10px] text-slate-500 mt-2 font-medium">Faculty session counts</span>
                    </button>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setReportType(null)} className="text-xs text-slate-500 hover:text-white">← Select Different Report</button>
                        <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black uppercase text-indigo-400">
                            {reportType} Report
                        </span>
                    </div>

                    {reportType === 'attendance' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Target Batch</label>
                            <select 
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white appearance-none outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Choose Batch...</option>
                                {batches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.department})</option>)}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                            disabled={isGenerating}
                            onClick={() => handleGenerate('pdf')}
                            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center hover:bg-slate-800 hover:border-red-500/50 transition-all group"
                        >
                            <div className="p-3 bg-red-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-red-400" />
                            </div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">PDF Report</span>
                            <span className="text-[8px] text-slate-600 mt-1 uppercase font-black tracking-tighter">Academic Record</span>
                        </button>
                        <button 
                            disabled={isGenerating}
                            onClick={() => handleGenerate('excel')}
                            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center hover:bg-slate-800 hover:border-emerald-500/50 transition-all group"
                        >
                            <div className="p-3 bg-emerald-500/10 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Excel Data</span>
                            <span className="text-[8px] text-slate-600 mt-1 uppercase font-black tracking-tighter">Spreadsheet Analysis</span>
                        </button>
                    </div>

                    {isGenerating && (
                        <div className="flex items-center justify-center space-x-3 py-4">
                            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest italic animate-pulse">Processing Intelligence...</span>
                        </div>
                    )}
                </motion.div>
            )}
            
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start space-x-3">
                <Database className="w-4 h-4 text-slate-600 mt-0.5" />
                <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed tracking-tight">Report data is fetched real-time from the central database. Ensure all attendance for the period is marked for accurate analytics.</p>
            </div>
        </div>
    );
}
