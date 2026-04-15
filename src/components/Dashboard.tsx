import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Cpu, Zap, Activity, Loader2 } from "lucide-react";
import { fetchDatasets, fetchModels } from "@/lib/api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const chartData = [
  { name: "01", accuracy: 40 },
  { name: "02", accuracy: 55 },
  { name: "03", accuracy: 45 },
  { name: "04", accuracy: 70 },
  { name: "05", accuracy: 65 },
  { name: "06", accuracy: 85 },
  { name: "07", accuracy: 75 },
  { name: "08", accuracy: 92 },
  { name: "09", accuracy: 98 },
  { name: "10", accuracy: 96 },
];

export function Dashboard() {
  const [stats, setStats] = useState({ datasets: 0, models: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [datasets, models] = await Promise.all([
        fetchDatasets(),
        fetchModels()
      ]);
      setStats({
        datasets: datasets.length,
        models: models.length
      });
    } catch (error) {
      console.error("Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Pipeline Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Running Cluster: Local_XAMPP_Docker_Bridge</p>
        </div>
        <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          SYSTEM ACTIVE: 99.9%
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Datasets" value={isLoading ? "..." : stats.datasets} icon={Database} trend="Ingested source files" />
        <StatCard title="Active Models" value={isLoading ? "..." : stats.models} icon={Cpu} trend="Deployed in registry" />
        <StatCard title="Avg. Inference" value="124ms" icon={Zap} trend="Response latency" />
        <StatCard title="Memory Load" value="2.4GB" icon={Activity} trend="Cluster utilization" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Model Performance Over Time</CardTitle>
            <span className="text-[10px] text-primary font-bold">Metric: Accuracy (%)</span>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Bar dataKey="accuracy" fill="#3B82F6" radius={[2, 2, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">System Bridge Logs</CardTitle>
            <span className="text-[10px] text-muted-foreground font-bold">Auto-Refreshing</span>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 font-mono text-[10px] text-emerald-500 h-[300px] overflow-hidden leading-relaxed">
              <div className="opacity-70">&gt; [09:24:12] INITIALIZING MCP SERVER BRIDGE...</div>
              <div className="opacity-70">&gt; [09:24:14] DB CONNECTION SUCCESS: root@localhost/automl_db</div>
              <div className="opacity-70">&gt; [09:24:15] LOADING MODEL: lead_predictor_v4.phpml</div>
              <div className="opacity-70">&gt; [09:24:15] MODEL LOADED SUCCESSFULLY (24.2MB)</div>
              <div className="opacity-70">&gt; [09:24:18] INCOMING REQUEST: INFERENCE_TASK_091</div>
              <div className="font-bold">&gt; [09:24:19] SUCCESS: Predicted Class [A] in 12ms</div>
              <div className="opacity-70">&gt; [09:24:22] SYNCING METRICS TO DASHBOARD...</div>
              <div className="animate-pulse">&gt; _</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="border-l-2 border-border pl-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tighter">{value}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">{trend}</p>
          </div>
          <div className="p-3 bg-primary/5 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
