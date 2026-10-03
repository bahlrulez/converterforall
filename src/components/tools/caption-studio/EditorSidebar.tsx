import React, { useRef, useEffect, useState } from 'react';
import { CaptionChunk, WorkerState } from '@/lib/caption-studio/types';
import { StyleSettings } from '@/lib/caption-studio/style-types';
import { FONT_OPTIONS, PRESETS, CURATED_PRESET_NAMES } from '@/lib/caption-studio/presets';

interface EditorSidebarProps {
  captions: CaptionChunk[];
  activeCaptionId: string | null;
  onCaptionEdit: (id: string, text: string) => void;
  onCaptionClick: (start: number) => void;
  onCaptionBlur?: () => void;
  onDelete?: (id: string) => void;
  onMergeNext?: (id: string) => void;
  onSplit?: (id: string, index: number) => void;
  onAutoSplit?: () => void;
  onTimeChange?: (id: string, field: 'start' | 'end', value: number) => void;
  disabled?: boolean;
  globalStyle?: StyleSettings;
  onStyleChange?: (style: StyleSettings) => void;
  onPresetSelect?: (presetName: string) => void;
  workerState?: WorkerState;
}

export function EditorSidebar({
  captions,
  activeCaptionId,
  onCaptionEdit,
  onCaptionClick,
  onCaptionBlur,
  onDelete,
  onMergeNext,
  onSplit,
  onAutoSplit,
  onTimeChange,
  disabled,
  globalStyle,
  onStyleChange,
  onPresetSelect,
  workerState
}: EditorSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState<{ id: string, index: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'EDIT' | 'STYLE'>('EDIT');
  
  useEffect(() => {
    if (activeTab === 'EDIT' && activeCaptionId && containerRef.current) {
      const activeElement = containerRef.current.querySelector(`[data-caption-id="${activeCaptionId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeCaptionId, activeTab]);

  const handleTimeBlur = (id: string, field: 'start' | 'end', val: string, fallback: number) => {
    if (!onTimeChange) return;
    const parsed = parseFloat(val);
    if (isNaN(parsed) || parsed < 0) return;
    onTimeChange(id, field, parsed);
  };

  const getGraphemeSafeSplitIndex = (text: string, index: number) => {
    if (!window.Intl || !window.Intl.Segmenter) {
      const before = text.lastIndexOf(' ', index);
      const after = text.indexOf(' ', index);
      if (before === -1 && after === -1) return index;
      if (before === -1) return after;
      if (after === -1) return before;
      return (index - before < after - index) ? before : after;
    }
    const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
    let closest = 0;
    for (const segment of segmenter.segment(text)) {
      if (segment.index <= index) closest = segment.index;
      else break;
    }
    return closest;
  };

  const handleSplitClick = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    if (!onSplit || !cursorPos || cursorPos.id !== id) return;
    const safeIndex = getGraphemeSafeSplitIndex(text, cursorPos.index);
    if (safeIndex > 0 && safeIndex < text.length) onSplit(id, safeIndex);
  };

  const updateStyle = (updates: Partial<StyleSettings>) => {
    if (onStyleChange && globalStyle) {
      onStyleChange({ ...globalStyle, ...updates });
    }
  };

  return (
    <div className="flex flex-col h-full h-96 sm:h-[500px]">
      <div className="flex items-center gap-2 pb-3 border-b mb-3">
        <button 
          onClick={() => setActiveTab('EDIT')} 
          className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'EDIT' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Captions
        </button>
        <button 
          onClick={() => setActiveTab('STYLE')} 
          className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'STYLE' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          Style
        </button>
      </div>
      
      {activeTab === 'EDIT' && (
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin pb-10"
        >
          <div className="flex justify-end mb-2">
            <button
              onClick={onAutoSplit}
              disabled={disabled || captions.length === 0}
              className="text-xs flex items-center gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md transition-colors"
              title="Split long captions automatically"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>
              Auto-split
            </button>
          </div>
          {captions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border/80 bg-muted/20 my-2">
              {workerState === 'INITIALIZING' ? (
                <>
                  <div className="flex items-center gap-1.5 mb-4 h-8" aria-hidden="true">
                    <span className="w-1.5 h-6 bg-primary/40 rounded-full motion-safe:animate-pulse [animation-delay:0ms]" />
                    <span className="w-1.5 h-8 bg-primary/70 rounded-full motion-safe:animate-pulse [animation-delay:150ms]" />
                    <span className="w-1.5 h-5 bg-primary rounded-full motion-safe:animate-pulse [animation-delay:300ms]" />
                    <span className="w-1.5 h-7 bg-primary/70 rounded-full motion-safe:animate-pulse [animation-delay:450ms]" />
                    <span className="w-1.5 h-4 bg-primary/40 rounded-full motion-safe:animate-pulse [animation-delay:600ms]" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Your captions will appear here
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    AI is preparing the speech model...
                  </p>
                </>
              ) : workerState === 'TRANSCRIBING' ? (
                <>
                  <div className="flex items-center gap-1.5 mb-4 h-8" aria-hidden="true">
                    <span className="w-1.5 h-5 bg-primary/50 rounded-full motion-safe:animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-8 bg-primary rounded-full motion-safe:animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-6 bg-primary/70 rounded-full motion-safe:animate-bounce [animation-delay:300ms]" />
                    <span className="w-1.5 h-7 bg-primary rounded-full motion-safe:animate-bounce [animation-delay:450ms]" />
                    <span className="w-1.5 h-4 bg-primary/50 rounded-full motion-safe:animate-bounce [animation-delay:600ms]" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Transcribing audio...
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Generating Devanagari Hindi timestamps with AI...
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-10 border border-border/80 rounded-lg p-2 flex flex-col justify-center gap-1 mb-3 opacity-60" aria-hidden="true">
                    <div className="h-1 bg-muted-foreground/30 rounded w-full" />
                    <div className="h-1 bg-muted-foreground/30 rounded w-2/3" />
                  </div>
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Your captions will appear here
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Select a video to automatically generate captions.
                  </p>
                </>
              )}
            </div>
          ) : (
            captions.map((caption, idx) => {
              const isActive = caption.id === activeCaptionId;
              return (
                <div 
                  key={caption.id}
                  data-caption-id={caption.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isActive 
                      ? 'border-primary ring-1 ring-primary shadow-sm bg-primary/5' 
                      : 'border-border bg-card hover:border-muted-foreground/30'
                  } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => onCaptionClick(caption.start)}
                >
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded" onClick={e => e.stopPropagation()}>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        aria-label="Caption start time"
                        className="w-16 bg-transparent border-b border-dashed border-transparent hover:border-muted-foreground focus:border-primary focus:outline-none p-0 text-center"
                        defaultValue={caption.start.toFixed(1)}
                        onBlur={(e) => handleTimeBlur(caption.id, 'start', e.target.value, caption.start)}
                        disabled={disabled}
                      />
                      <span>-</span>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        aria-label="Caption end time"
                        className="w-16 bg-transparent border-b border-dashed border-transparent hover:border-muted-foreground focus:border-primary focus:outline-none p-0 text-center"
                        defaultValue={caption.end.toFixed(1)}
                        onBlur={(e) => handleTimeBlur(caption.id, 'end', e.target.value, caption.end)}
                        disabled={disabled}
                      />
                    </div>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <textarea
                    value={caption.text}
                    onChange={(e) => onCaptionEdit(caption.id, e.target.value)}
                    onBlur={() => onCaptionBlur && onCaptionBlur()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCursorPos({ id: caption.id, index: e.currentTarget.selectionStart });
                    }}
                    onSelect={(e) => setCursorPos({ id: caption.id, index: e.currentTarget.selectionStart })}
                    onKeyUp={(e) => setCursorPos({ id: caption.id, index: e.currentTarget.selectionStart })}
                    className="w-full text-sm bg-transparent border-0 resize-none focus:ring-0 focus:outline-none p-0 mb-2"
                    rows={2}
                    placeholder="Caption text..."
                    aria-label="Edit caption"
                    disabled={disabled}
                  />
                  
                  {!disabled && (
                    <div className="flex items-center gap-2 pt-2 border-t mt-1" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={(e) => handleSplitClick(e, caption.id, caption.text)}
                        disabled={!cursorPos || cursorPos.id !== caption.id || cursorPos.index === 0 || cursorPos.index === caption.text.length}
                        aria-label="Split caption at cursor"
                        className="min-h-[32px] inline-flex items-center justify-center text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50"
                      >
                        Split
                      </button>
                      {idx < captions.length - 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onMergeNext?.(caption.id); }}
                          aria-label="Merge with next caption"
                          className="min-h-[32px] inline-flex items-center justify-center text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                        >
                          Merge Next
                        </button>
                      )}
                      <div className="flex-1"></div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete?.(caption.id); }}
                        aria-label="Delete caption"
                        className="min-h-[32px] inline-flex items-center justify-center text-xs px-2.5 py-1 text-destructive hover:bg-destructive/10 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Style & Preset Customizer Tab */}
      {activeTab === 'STYLE' && globalStyle && (
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin pb-10">
          
          <div className="space-y-3">
            <label className="text-sm font-semibold">Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {CURATED_PRESET_NAMES.map(preset => (
                <button
                  key={preset}
                  onClick={() => onPresetSelect && onPresetSelect(preset)}
                  aria-label={`Apply ${preset} caption preset`}
                  className="min-h-[40px] px-3 py-2 text-xs bg-muted border rounded-md hover:bg-accent hover:text-accent-foreground text-left font-medium transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-3 rounded-xl bg-muted/40 border">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="active-word-highlight-toggle"
                    aria-label="Toggle active word highlighting"
                    checked={Boolean(globalStyle.activeWordHighlight)}
                    onChange={e => updateStyle({ activeWordHighlight: e.target.checked })}
                    className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span>Active Word Highlighting</span>
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Visually highlights each spoken word in sync with video audio
                </p>
              </div>
            </div>

            {globalStyle.activeWordHighlight && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Highlight Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      aria-label="Active word highlight color"
                      value={globalStyle.activeWordColor || '#FFDE59'}
                      onChange={e => updateStyle({ activeWordColor: e.target.value })}
                      className="h-8 w-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      aria-label="Active word highlight hex code"
                      value={globalStyle.activeWordColor || '#FFDE59'}
                      onChange={e => updateStyle({ activeWordColor: e.target.value })}
                      className="w-20 text-xs px-1.5 py-1 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Word Background</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      aria-label="Active word box color"
                      value={globalStyle.activeWordBackgroundColor?.startsWith('#') ? globalStyle.activeWordBackgroundColor : '#000000'}
                      onChange={e => updateStyle({ activeWordBackgroundColor: e.target.value })}
                      className="h-8 w-8 rounded cursor-pointer"
                      disabled={!globalStyle.activeWordBackgroundColor}
                    />
                    <button
                      onClick={() => updateStyle({
                        activeWordBackgroundColor: globalStyle.activeWordBackgroundColor ? undefined : '#000000'
                      })}
                      aria-label={globalStyle.activeWordBackgroundColor ? 'Remove background box' : 'Add background box'}
                      className="min-h-[32px] text-xs px-2.5 py-1 bg-secondary rounded hover:bg-secondary/80 text-secondary-foreground"
                    >
                      {globalStyle.activeWordBackgroundColor ? 'Remove' : 'Add Box'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div className="space-y-3">
            <label className="text-sm font-semibold">Text Settings</label>
            
            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">Font Family</label>
              <select 
                value={globalStyle.fontFamily}
                onChange={e => updateStyle({ fontFamily: e.target.value })}
                className="w-full bg-background border rounded px-2 py-1.5 text-sm"
              >
                {FONT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <label className="text-xs text-muted-foreground">Size</label>
              <span className="text-xs">{Math.round(globalStyle.fontSize * 100)}%</span>
              <input 
                type="range" min="0.02" max="0.15" step="0.005"
                value={globalStyle.fontSize}
                onChange={e => updateStyle({ fontSize: parseFloat(e.target.value) })}
                className="col-span-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={globalStyle.textColor} onChange={e => updateStyle({ textColor: e.target.value })} className="h-8 w-8 rounded cursor-pointer" />
                  <input type="text" value={globalStyle.textColor} onChange={e => updateStyle({ textColor: e.target.value })} className="w-20 text-xs px-1 border rounded" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Alignment</label>
                <select 
                  value={globalStyle.textAlign} 
                  onChange={e => updateStyle({ textAlign: e.target.value as CanvasTextAlign })}
                  className="w-full bg-background border rounded px-2 py-1 text-sm h-8"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>

          <hr />

          <div className="space-y-3">
            <label className="text-sm font-semibold">Outline & Shadow</label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Outline Color</label>
                <input type="color" value={globalStyle.outlineColor} onChange={e => updateStyle({ outlineColor: e.target.value })} className="h-8 w-full rounded cursor-pointer" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Outline Width</label>
                <input 
                  type="range" min="0" max="0.03" step="0.001"
                  value={globalStyle.outlineWidth}
                  onChange={e => updateStyle({ outlineWidth: parseFloat(e.target.value) })}
                  className="w-full mt-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-xs text-muted-foreground block mb-1">Shadow Color</label>
                <input type="text" placeholder="rgba(0,0,0,0.5)" value={globalStyle.shadowColor} onChange={e => updateStyle({ shadowColor: e.target.value })} className="w-full text-xs px-2 py-1.5 border rounded h-8" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Shadow Blur</label>
                <input 
                  type="range" min="0" max="0.05" step="0.005"
                  value={globalStyle.shadowBlur}
                  onChange={e => updateStyle({ shadowBlur: parseFloat(e.target.value) })}
                  className="w-full mt-2"
                />
              </div>
            </div>
          </div>

          <hr />

          <div className="space-y-3">
            <label className="text-sm font-semibold">Background Box</label>
            
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <label className="text-xs text-muted-foreground">Opacity</label>
              <span className="text-xs">{Math.round(globalStyle.backgroundOpacity * 100)}%</span>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={globalStyle.backgroundOpacity}
                onChange={e => updateStyle({ backgroundOpacity: parseFloat(e.target.value) })}
                className="col-span-2"
              />
            </div>

            {globalStyle.backgroundOpacity > 0 && (
              <>
                <div className="grid gap-2">
                  <label className="text-xs text-muted-foreground">Box Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={globalStyle.backgroundColor} onChange={e => updateStyle({ backgroundColor: e.target.value })} className="h-8 w-8 rounded cursor-pointer" />
                    <input type="text" value={globalStyle.backgroundColor} onChange={e => updateStyle({ backgroundColor: e.target.value })} className="w-20 text-xs px-1 border rounded h-8" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Padding</label>
                    <input 
                      type="range" min="0" max="0.1" step="0.005"
                      value={globalStyle.backgroundPadding}
                      onChange={e => updateStyle({ backgroundPadding: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Corner Radius</label>
                    <input 
                      type="range" min="0" max="0.05" step="0.005"
                      value={globalStyle.backgroundRadius}
                      onChange={e => updateStyle({ backgroundRadius: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
