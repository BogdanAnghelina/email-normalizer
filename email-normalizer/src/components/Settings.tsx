'use client'

import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Settings2 } from 'lucide-react'

type ReplacementRule = {
  from: string;
  to: string;
  action: 'replace' | 'keep';
};

const defaultReplacements: ReplacementRule[] = [
  { from: 'á', to: 'a', action: 'replace' },
  { from: 'é', to: 'e', action: 'replace' },
  { from: 'í', to: 'i', action: 'replace' },
  { from: 'ó', to: 'o', action: 'replace' },
  { from: 'ú', to: 'u', action: 'replace' },
  { from: 'ñ', to: 'n', action: 'replace' },
];

export function SettingsDialog() {
  const [replacements, setReplacements] = useState<ReplacementRule[]>(defaultReplacements);
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');

  useEffect(() => {
    const savedReplacements = localStorage.getItem('emailNormalizerReplacements');
    if (savedReplacements) {
      setReplacements(JSON.parse(savedReplacements));
    }
  }, []);

  const handleActionChange = (index: number, action: 'replace' | 'keep') => {
    const newReplacements = [...replacements];
    newReplacements[index].action = action;
    setReplacements(newReplacements);
  };

  const handleAddReplacement = () => {
    if (newFrom && newTo) {
      setReplacements([...replacements, { from: newFrom, to: newTo, action: 'replace' }]);
      setNewFrom('');
      setNewTo('');
    }
  };

  const handleSave = () => {
    localStorage.setItem('emailNormalizerReplacements', JSON.stringify(replacements));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 right-4">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Email Normalizer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {replacements.map((rule, index) => (
            <div key={index} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={`from-${index}`} className="text-right">
                {rule.from}
              </Label>
              <Select
                value={rule.action}
                onValueChange={(value: 'replace' | 'keep') => handleActionChange(index, value)}
              >
                <SelectTrigger id={`to-${index}`}>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="replace">Replace with &apos;{rule.to}&apos;</SelectItem>
                  <SelectItem value="keep">Don&apos;t replace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          <div className="grid grid-cols-3 items-center gap-4">
            <Input
              id="new-from"
              value={newFrom}
              onChange={(e) => setNewFrom(e.target.value)}
              placeholder="New character"
              className="col-span-1"
            />
            <Input
              id="new-to"
              value={newTo}
              onChange={(e) => setNewTo(e.target.value)}
              placeholder="Replace with"
              className="col-span-1"
            />
            <Button onClick={handleAddReplacement}>Add</Button>
          </div>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </DialogContent>
    </Dialog>
  );
}