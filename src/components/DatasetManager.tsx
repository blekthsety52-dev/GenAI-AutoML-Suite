import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, FileText, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchDatasets, saveDataset } from "@/lib/api";
import { Dataset } from "@/types";
import { analyzeDataset } from "@/lib/gemini";

export function DatasetManager() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const data = await fetchDatasets();
      setDatasets(data);
    } catch (error) {
      toast.error("Failed to load datasets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        const analysis = await analyzeDataset(content);
        const newDataset = await saveDataset({
          name: file.name,
          description: analysis.summary,
          rowCount: analysis.rowCount,
          schema: analysis.schema,
          updatedAt: new Date().toISOString(),
        });
        setDatasets(prev => [...prev, newDataset]);
        toast.success("Dataset uploaded and analyzed");
      } catch (error) {
        toast.error("Failed to process dataset");
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter">Dataset Ingestion</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage and orchestrate your training data.</p>
        </div>
        <div className="relative">
          <Input
            type="file"
            accept=".csv"
            className="hidden"
            id="dataset-upload"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button asChild disabled={isUploading} className="bg-primary hover:bg-primary/90 text-white font-bold">
            <label htmlFor="dataset-upload" className="cursor-pointer flex items-center">
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {isUploading ? "Processing..." : "Upload CSV"}
            </label>
          </Button>
        </div>
      </header>

      <Card className="bg-card border-border">
        <CardHeader className="pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search datasets..." 
              className="pl-10 bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading datasets...</p>
            </div>
          ) : datasets.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>No datasets found. Upload your first CSV to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[300px] text-[10px] uppercase tracking-widest font-bold">Name</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold">Rows</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold">Created</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold">Schema</TableHead>
                  <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((dataset) => (
                  <TableRow key={dataset.id} className="border-border group hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{dataset.name}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{dataset.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{dataset.rowCount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(dataset.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {dataset.schema.slice(0, 3).map(s => (
                          <Badge key={s} variant="secondary" className="text-[9px] px-1.5 py-0 bg-secondary text-muted-foreground border-border">
                            {s}
                          </Badge>
                        ))}
                        {dataset.schema.length > 3 && <span className="text-[9px] text-muted-foreground">+{dataset.schema.length - 3}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
