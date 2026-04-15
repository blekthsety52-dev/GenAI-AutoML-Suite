import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Plus, MoreVertical, History, Settings2, ShieldCheck, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { fetchModels, saveModel, fetchDatasets } from "@/lib/api";
import { Model, Dataset } from "@/types";
import { toast } from "sonner";

export function ModelManager() {
  const [models, setModels] = useState<Model[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newInstruction, setNewInstruction] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [modelsData, datasetsData] = await Promise.all([
        fetchModels(),
        fetchDatasets()
      ]);
      setModels(modelsData);
      setDatasets(datasetsData);
    } catch (error) {
      toast.error("Failed to load models or datasets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateModel = async () => {
    if (!newName.trim() || !newInstruction.trim()) return;

    setIsCreating(true);
    try {
      const newModel = await saveModel({
        name: newName,
        description: newDesc,
        systemInstruction: newInstruction,
        datasetId: selectedDataset || undefined,
        version: "1.0.0",
        updatedAt: new Date().toISOString(),
      });
      setModels(prev => [...prev, newModel]);
      toast.success("Model created successfully");
      setIsDialogOpen(false);
      // Reset form
      setNewName("");
      setNewDesc("");
      setNewInstruction("");
      setSelectedDataset("");
    } catch (error) {
      toast.error("Failed to create model");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter">Model Registry</h2>
          <p className="text-muted-foreground text-sm mt-1">Configure and deploy your AI models.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Create Model
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Model</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Define your model's purpose and system instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                <Input 
                  placeholder="e.g. Sentiment Analyzer" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <Input 
                  placeholder="Short summary of the model's goal" 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Instruction</label>
                <Textarea 
                  placeholder="You are an AI assistant that..." 
                  className="min-h-[100px] bg-background border-border"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reference Dataset (Optional)</label>
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {datasets.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border hover:bg-secondary">Cancel</Button>
              <Button onClick={handleCreateModel} disabled={isCreating} className="bg-primary hover:bg-primary/90 text-white">
                {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Model
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading models...</p>
        </div>
      ) : models.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
          <Cpu className="w-12 h-12 mb-4 opacity-20" />
          <p>No models found. Create your first model to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <Card key={model.id} className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-secondary">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="hover:bg-secondary">Edit Configuration</DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-secondary">View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive hover:bg-destructive/10">Delete Model</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 border-l-2 border-border pl-4">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg tracking-tight">{model.name}</CardTitle>
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest">
                      Active
                    </Badge>
                  </div>
                  <CardDescription className="mt-1 line-clamp-2 text-muted-foreground text-xs">{model.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Version
                    </span>
                    <span className="font-mono text-foreground">{model.version}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Settings2 className="w-3.5 h-3.5" /> Dataset
                    </span>
                    <span className="text-foreground">
                      {datasets.find(d => d.id === model.datasetId)?.name || "None"}
                    </span>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button variant="outline" className="flex-1 text-[10px] uppercase tracking-widest font-bold h-8 border-border hover:bg-primary/10 hover:text-primary">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                      Test
                    </Button>
                    <Button variant="outline" className="flex-1 text-[10px] uppercase tracking-widest font-bold h-8 border-border hover:bg-primary/10 hover:text-primary">
                      Deploy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
