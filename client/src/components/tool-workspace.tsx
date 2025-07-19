import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ToolWorkspaceProps {
  tool: any;
  onUse: () => void;
  isLoading: boolean;
}

export default function ToolWorkspace({ tool, onUse, isLoading }: ToolWorkspaceProps) {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateInput = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateInput('file', file);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready for processing`,
      });
    }
  };

  const processWithTool = async () => {
    setProcessing(true);
    try {
      // Simulate tool processing based on tool category
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = generateMockResults(tool, inputs);
      setResults(mockResults);
      onUse();
      
      toast({
        title: "Processing complete",
        description: "Your tool has finished processing successfully!",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const generateMockResults = (tool: any, inputs: any) => {
    const category = tool.categorySlug || '';
    
    if (category.includes('pdf')) {
      return {
        type: 'pdf',
        message: 'PDF processed successfully',
        downloadUrl: '#',
        fileSize: '2.4 MB',
        pages: Math.floor(Math.random() * 10) + 1
      };
    }
    
    if (category.includes('image')) {
      return {
        type: 'image',
        message: 'Image processed successfully',
        downloadUrl: '#',
        before: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop',
        after: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop&sat=2&con=1.2'
      };
    }
    
    if (category.includes('ai') || category.includes('text')) {
      return {
        type: 'text',
        message: 'Text generated successfully',
        output: `Generated content based on your input: "${inputs.text || 'sample input'}". This is a high-quality AI-generated response that demonstrates the tool's capabilities. The content is engaging, relevant, and professionally crafted to meet your specific needs.`
      };
    }
    
    if (category.includes('code')) {
      return {
        type: 'code',
        message: 'Code generated successfully',
        language: inputs.language || 'javascript',
        code: `// Generated ${inputs.language || 'JavaScript'} code
function processData(input) {
  // AI-generated function based on your requirements
  const result = input.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
  
  return result.filter(item => item.isValid);
}

export default processData;`
      };
    }
    
    // Default result
    return {
      type: 'general',
      message: 'Tool executed successfully',
      status: 'completed',
      processingTime: '1.2s'
    };
  };

  const renderInputs = () => {
    const category = tool.categorySlug || '';
    
    if (category.includes('pdf')) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="pdf-file">Upload PDF File</Label>
            <Input
              id="pdf-file"
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileUpload}
              className="glass border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="operation">Operation</Label>
            <Select onValueChange={(value) => updateInput('operation', value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent className="glass-dark border-white/20">
                <SelectItem value="compress">Compress PDF</SelectItem>
                <SelectItem value="split">Split PDF</SelectItem>
                <SelectItem value="merge">Merge PDFs</SelectItem>
                <SelectItem value="convert">Convert to Images</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    if (category.includes('image')) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="image-file">Upload Image</Label>
            <Input
              id="image-file"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="glass border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="filter">Apply Filter</Label>
            <Select onValueChange={(value) => updateInput('filter', value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent className="glass-dark border-white/20">
                <SelectItem value="enhance">AI Enhance</SelectItem>
                <SelectItem value="upscale">Upscale 4x</SelectItem>
                <SelectItem value="remove-bg">Remove Background</SelectItem>
                <SelectItem value="colorize">Colorize</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quality">Quality: {inputs.quality || 80}%</Label>
            <Slider
              id="quality"
              min={10}
              max={100}
              step={10}
              value={[inputs.quality || 80]}
              onValueChange={([value]) => updateInput('quality', value)}
              className="mt-2"
            />
          </div>
        </div>
      );
    }
    
    if (category.includes('ai') || category.includes('text')) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Enter your prompt or text</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to generate or analyze..."
              value={inputs.text || ''}
              onChange={(e) => updateInput('text', e.target.value)}
              className="glass border-white/20 min-h-32"
            />
          </div>
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Select onValueChange={(value) => updateInput('tone', value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent className="glass-dark border-white/20">
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced"
              checked={inputs.advanced || false}
              onCheckedChange={(checked) => updateInput('advanced', checked)}
            />
            <Label htmlFor="advanced">Use advanced AI model</Label>
          </div>
        </div>
      );
    }
    
    if (category.includes('code')) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Describe what you want to build</Label>
            <Textarea
              id="description"
              placeholder="Describe the function, component, or script you need..."
              value={inputs.description || ''}
              onChange={(e) => updateInput('description', e.target.value)}
              className="glass border-white/20 min-h-32"
            />
          </div>
          <div>
            <Label htmlFor="language">Programming Language</Label>
            <Select onValueChange={(value) => updateInput('language', value)}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="glass-dark border-white/20">
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="nodejs">Node.js</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    // Default inputs
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="input-text">Input</Label>
          <Textarea
            id="input-text"
            placeholder="Enter your input here..."
            value={inputs.text || ''}
            onChange={(e) => updateInput('text', e.target.value)}
            className="glass border-white/20"
          />
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-check-circle text-green-400 mr-2"></i>
            Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.type === 'pdf' && (
            <div className="space-y-4">
              <p className="text-green-400">{results.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>File Size: {results.fileSize}</div>
                <div>Pages: {results.pages}</div>
              </div>
              <Button className="gradient-primary">
                <i className="fas fa-download mr-2"></i>
                Download Processed PDF
              </Button>
            </div>
          )}
          
          {results.type === 'image' && (
            <div className="space-y-4">
              <p className="text-green-400">{results.message}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Before</p>
                  <img src={results.before} alt="Before" className="w-full rounded-lg" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">After</p>
                  <img src={results.after} alt="After" className="w-full rounded-lg" />
                </div>
              </div>
              <Button className="gradient-primary w-full">
                <i className="fas fa-download mr-2"></i>
                Download Enhanced Image
              </Button>
            </div>
          )}
          
          {results.type === 'text' && (
            <div className="space-y-4">
              <p className="text-green-400">{results.message}</p>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-gray-200 leading-relaxed">{results.output}</p>
              </div>
              <Button variant="outline" className="glass border-white/20">
                <i className="fas fa-copy mr-2"></i>
                Copy to Clipboard
              </Button>
            </div>
          )}
          
          {results.type === 'code' && (
            <div className="space-y-4">
              <p className="text-green-400">{results.message}</p>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{results.language}</span>
                  <Button size="sm" variant="ghost">
                    <i className="fas fa-copy"></i>
                  </Button>
                </div>
                <pre className="text-sm text-gray-200 overflow-x-auto">
                  <code>{results.code}</code>
                </pre>
              </div>
            </div>
          )}
          
          {results.type === 'general' && (
            <div className="space-y-4">
              <p className="text-green-400">{results.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Status: {results.status}</div>
                <div>Processing Time: {results.processingTime}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle>Tool Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          {renderInputs()}
          
          <div className="mt-6">
            <Button
              onClick={processWithTool}
              disabled={processing || isLoading}
              className="gradient-primary w-full py-3"
            >
              {processing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-2"></i>
                  Run {tool.name}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderResults()}
        </motion.div>
      )}
    </div>
  );
}