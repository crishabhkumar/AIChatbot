import React, { useState } from 'react';
import { ChatSettings, AIProvider, getProviderDisplayName, getProviderModel } from '../types';
import { Settings, Thermometer, Hash, Bot, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface SettingsPanelProps {
  settings: ChatSettings;
  setSettings: (settings: ChatSettings) => void;
  availableProviders: AIProvider[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  setSettings,
  availableProviders
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="settings-panel-collapsible">
      {/* Compact Header - Always Visible */}
      <div 
        className="settings-header-compact"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="settings-title-compact">
          <Settings size={16} className="settings-icon-compact" />
          <span>Settings</span>
          <div className="settings-preview">
            <span className="preview-item">🌡️ {settings.temperature}</span>
            <span className="preview-item">📏 {settings.maxTokens}</span>
          </div>
        </div>
        <div className="expand-button">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`settings-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="settings-grid-compact">
          {/* AI Provider Selection */}
          <div className="setting-card-compact">
            <div className="setting-label-compact">
              <Bot size={14} className="label-icon" />
              <span>Provider</span>
            </div>
            <select
              value={settings.selectedProvider !== undefined ? settings.selectedProvider.toString() : ''}
              onChange={(e) => {
                const providerValue = e.target.value;
                const provider = providerValue === '' ? undefined : parseInt(providerValue) as AIProvider;
                setSettings({ ...settings, selectedProvider: provider });
              }}
              className="modern-select-compact"
            >
              <option value="">🔄 Auto-fallback</option>
              {availableProviders.map((provider) => (
                <option key={provider} value={provider.toString()}>
                  {getProviderDisplayName(provider)}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature Slider */}
          <div className="setting-card-compact">
            <div className="setting-label-compact">
              <Thermometer size={14} className="label-icon" />
              <span>Temperature</span>
              <span className="setting-value-compact">{settings.temperature}</span>
            </div>
            <div className="slider-container-compact">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="modern-slider-compact temperature-slider"
              />
              <div className="slider-labels-compact">
                <span className="slider-label-compact">Conservative</span>
                <span className="slider-label-compact">Balanced</span>
                <span className="slider-label-compact">Creative</span>
              </div>
            </div>
          </div>

          {/* Max Tokens Slider */}
          <div className="setting-card-compact">
            <div className="setting-label-compact">
              <Hash size={14} className="label-icon" />
              <span>Max Tokens</span>
              <span className="setting-value-compact">{settings.maxTokens}</span>
            </div>
            <div className="slider-container-compact">
              <input
                type="range"
                min="1"
                max="4000"
                step="50"
                value={settings.maxTokens}
                onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                className="modern-slider-compact tokens-slider"
              />
              <div className="slider-labels-compact">
                <span className="slider-label-compact">Short</span>
                <span className="slider-label-compact">Medium</span>
                <span className="slider-label-compact">Long</span>
              </div>
            </div>
          </div>

          {/* System Message */}
          <div className="setting-card-compact system-message-card-compact">
            <div className="setting-label-compact">
              <Zap size={14} className="label-icon" />
              <span>System Message</span>
            </div>
            <textarea
              value={settings.systemMessage}
              onChange={(e) => setSettings({ ...settings, systemMessage: e.target.value })}
              placeholder="Define AI behavior..."
              className="modern-textarea-compact"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
