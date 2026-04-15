import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Send, Sparkles, Clock, Zap, Copy, Loader2 } from "lucide-react";
import { generatePrediction } from "@/lib/gemini";
import { fetchModels } from "@/lib/api";
import { Model } from "@/types";
import { toast } from "sonner";
import { motion } from "motion/react";

export function Playground() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await fetchModels();
      setModels(data);
      if (data.length > 0) {
        setSelectedModelId(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load models");
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    const start = performance.now();
    
    const model = models.find(m => m.id === selectedModelId);
    
    try {
      const output = await generatePrediction(prompt, model?.systemInstruction);
      setResult(output || "No output generated.");
      setLatency(Math.round(performance.now() - start));
      toast.success("Prediction complete");
    } catch (error) {
      toast.error("Failed to generate prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter">Inference Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1">Test your models in real-time with live inference.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Select Model</label>
                {isFetchingModels ? (
                  <div className="h-10 bg-secondary rounded-md animate-pulse" />
                ) : (
                  <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {models.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="pt-4 space-y-2 border-t border-border">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-muted-foreground">Model Type</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Gemini 3 Flash</Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="text-foreground">0.7</span>
                </div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-muted-foreground">Max Tokens</span>
                  <span className="text-foreground">2048</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 border-l-2 border-border pl-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Latency</p>
                  <p className="font-mono font-bold text-foreground">{latency ? `${latency}ms` : "--"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l-2 border-border pl-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Tokens</p>
                  <p className="font-mono font-bold text-foreground">~{result ? Math.round(result.length / 4) : "--"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Inference Engine</CardTitle>
              <Button 
                onClick={handleRun} 
                disabled={isLoading || !prompt.trim() || !selectedModelId}
                className="bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {isLoading ? "Running..." : "Run Inference"}
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Input Prompt</label>
                <Textarea 
                  placeholder="Enter your prompt here..." 
                  className="min-h-[150px] bg-background border-border focus-visible:ring-1 focus-visible:ring-primary resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Output Terminal</label>
                  {result && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary" onClick={() => {
                      navigator.clipboard.writeText(result);
                      toast.success("Copied to clipboard");
                    }}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 bg-black rounded-lg p-6 font-mono text-xs text-emerald-500 overflow-y-auto relative min-h-[200px] border border-border">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>Generating response...</span>
                    </div>
                  ) : result ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-pre-wrap leading-relaxed"
                    >
                      <span className="opacity-50 mr-2">&gt;</span>
                      {result}
                    </motion.div>
                  ) : (
                    <span className="text-muted-foreground/30 italic">&gt; Output will appear here after running inference.</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
