"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";
import { BarChart3 } from "lucide-react";

const COLORS = ["#2DD4BF", "#FB923C", "#6366F1", "#A855F7", "#F43F5E", "#EAB308"];

export default function FacultyLoadChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchLoad = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/attendance/faculty-load`, config);
                setData(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (userInfo) fetchLoad();
    }, [userInfo]);

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
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: '1px solid #334155',
                                borderRadius: '12px',
                                fontSize: '10px'
                            }}
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
