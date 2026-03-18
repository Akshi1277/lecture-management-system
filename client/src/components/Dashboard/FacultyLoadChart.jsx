"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { fetchFacultyLoad } from "@/redux/slices/dashboardSlice";

const COLORS = ["#2DD4BF", "#FB923C", "#6366F1", "#A855F7", "#F43F5E", "#EAB308"];

export default function FacultyLoadChart() {
    const { facultyLoad: data, loading } = useSelector((state) => state.dashboard);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchFacultyLoad());
        }
    }, [userInfo, dispatch]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl backdrop-blur-md shadow-2xl">
                    <p className="text-white font-bold text-xs mb-1 uppercase italic tracking-wider">{label}</p>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }}></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase">
                            Count : <span className="text-teal-400">{payload[0].value}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="h-[300px] flex items-center justify-center text-slate-500 italic">Calculating workload...</div>;

    return (
        <div className="w-full h-full space-y-4">
            <div className="flex items-center space-x-2 text-slate-400 mb-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Faculty Workload (Lectures/Month)</span>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis
                            dataKey="teacher"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            content={<CustomTooltip />}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
