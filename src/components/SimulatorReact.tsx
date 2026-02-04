import React, { useState, useMemo, useCallback } from 'react';
import {
  calculerSimulation,
  formatCurrency,
  formatNumber,
  type SimulationInput,
  type SimulationResult,
  type Region,
} from '../utils/calculations';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  codePostal: string;
  consentement: boolean;
  consentementPartenaires: boolean;
}

const initialSimInput: SimulationInput = {
  budgetElecAnnuel: 1800,
  surfaceToiture: 50,
  region: 'centre',
  avecBatterie: false,
  capaciteBatterie: 10,
  avecBorne: false,
  kmAnnuelsVE: 15000,
};

const initialFormData: FormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  codePostal: '',
  consentement: false,
  consentementPartenaires: false,
};

export default function SimulatorReact() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [simInput, setSimInput] = useState<SimulationInput>(initialSimInput);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const results = useMemo<SimulationResult>(() => {
    return calculerSimulation(simInput);
  }, [simInput]);

  const handleInputChange = useCallback((field: keyof SimulationInput, value: number | boolean | Region) => {
    setSimInput((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFormChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentement) {
      setSubmitError('Veuillez accepter les conditions pour continuer.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const leadData = {
        ...formData,
        simulation: simInput,
        resultats: results,
        timestamp: new Date().toISOString(),
        source: 'simulateur-web',
      };
      console.log('Lead data:', leadData);
      setSubmitSuccess(true);
      setStep(3);
    } catch (error) {
      setSubmitError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-dark-200 text-dark-500'}`}>
              {s === 3 && submitSuccess ? '✓' : s}
            </div>
            {s < 3 && <div className={`w-16 h-1 rounded-full transition-all ${step > s ? 'bg-primary-600' : 'bg-dark-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {step === 1 && (
          <div className="p-6 md:p-10">
            <h3 className="text-2xl font-bold text-dark-900 mb-2">Votre situation énergétique</h3>
            <p className="text-dark-500 mb-8">Ajustez les curseurs pour correspondre à votre situation réelle.</p>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-semibold text-dark-700">💡 Budget électricité annuel</label>
                  <span className="text-2xl font-bold text-primary-600">{formatCurrency(simInput.budgetElecAnnuel)}</span>
                </div>
                <input type="range" min="600" max="6000" step="100" value={simInput.budgetElecAnnuel} onChange={(e) => handleInputChange('budgetElecAnnuel', Number(e.target.value))} className="range-slider" />
                <div className="flex justify-between text-sm text-dark-400 mt-1"><span>600€</span><span>6 000€</span></div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-semibold text-dark-700">🏠 Surface de toiture exploitable</label>
                  <span className="text-2xl font-bold text-primary-600">{simInput.surfaceToiture} m²</span>
                </div>
                <input type="range" min="15" max="150" step="5" value={simInput.surfaceToiture} onChange={(e) => handleInputChange('surfaceToiture', Number(e.target.value))} className="range-slider" />
                <div className="flex justify-between text-sm text-dark-400 mt-1"><span>15 m²</span><span>150 m²</span></div>
              </div>

              <div>
                <label className="font-semibold text-dark-700 block mb-3">📍 Votre région</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'nord', label: 'Nord', desc: '~1 000 kWh/kWc' },
                    { value: 'centre', label: 'Centre', desc: '~1 200 kWh/kWc' },
                    { value: 'sud', label: 'Sud', desc: '~1 400 kWh/kWc' },
                  ].map((region) => (
                    <button key={region.value} type="button" onClick={() => handleInputChange('region', region.value as Region)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${simInput.region === region.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-dark-200 hover:border-primary-300'}`}>
                      <span className="block font-semibold">{region.label}</span>
                      <span className="block text-xs text-dark-500 mt-1">{region.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${simInput.avecBatterie ? 'border-primary-500 bg-primary-50' : 'border-dark-200 hover:border-primary-300'}`}
                  onClick={() => handleInputChange('avecBatterie', !simInput.avecBatterie)}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={simInput.avecBatterie} onChange={(e) => handleInputChange('avecBatterie', e.target.checked)} className="form-checkbox" />
                    <div>
                      <span className="font-semibold text-dark-800 block">🔋 Batterie de stockage</span>
                      <span className="text-sm text-dark-500">Passez de 35% à 70% d'autoconsommation</span>
                    </div>
                  </div>
                  {simInput.avecBatterie && (
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-dark-600">Capacité</span>
                        <span className="font-semibold text-primary-600">{simInput.capaciteBatterie} kWh</span>
                      </div>
                      <input type="range" min="5" max="20" step="1" value={simInput.capaciteBatterie} onChange={(e) => handleInputChange('capaciteBatterie', Number(e.target.value))} className="range-slider w-full" />
                    </div>
                  )}
                </div>

                <div className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${simInput.avecBorne ? 'border-electric-500 bg-electric-50' : 'border-dark-200 hover:border-electric-300'}`}
                  onClick={() => handleInputChange('avecBorne', !simInput.avecBorne)}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={simInput.avecBorne} onChange={(e) => handleInputChange('avecBorne', e.target.checked)} className="form-checkbox" />
                    <div>
                      <span className="font-semibold text-dark-800 block">⚡ Borne de recharge VE</span>
                      <span className="text-sm text-dark-500">Rechargez avec votre propre électricité</span>
                    </div>
                  </div>
                  {simInput.avecBorne && (
                    <div className="mt-4 pt-4 border-t border-electric-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-dark-600">Km/an en VE</span>
                        <span className="font-semibold text-electric-600">{formatNumber(simInput.kmAnnuelsVE || 15000)} km</span>
                      </div>
                      <input type="range" min="5000" max="40000" step="1000" value={simInput.kmAnnuelsVE} onChange={(e) => handleInputChange('kmAnnuelsVE', Number(e.target.value))} className="range-slider w-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-br from-primary-50 to-solar-50 rounded-2xl border border-primary-100">
              <h4 className="font-bold text-dark-900 mb-4 flex items-center gap-2"><span className="text-2xl">📊</span> Estimation instantanée</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="block text-sm text-dark-500 mb-1">Puissance</span>
                  <span className="block text-2xl font-bold text-primary-600">{results.puissanceRecommandee} kWc</span>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="block text-sm text-dark-500 mb-1">Économies/an</span>
                  <span className="block text-2xl font-bold text-solar-600">{formatCurrency(results.economiesAnnuelles)}</span>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="block text-sm text-dark-500 mb-1">ROI estimé</span>
                  <span className="block text-2xl font-bold text-electric-600">{results.tempsRetourInvestissement} ans</span>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="block text-sm text-dark-500 mb-1">Gain sur 25 ans</span>
                  <span className="block text-2xl font-bold text-primary-700">{formatCurrency(results.rentabiliteSur25Ans)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button type="button" onClick={() => setStep(2)} className="btn-primary btn-lg">
                Recevoir mon étude personnalisée gratuite
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <p className="text-sm text-dark-400 mt-3">Sans engagement • Conseiller dédié • Devis détaillé sous 48h</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 md:p-10">
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-dark-500 hover:text-primary-600 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Modifier ma simulation
            </button>

            <h3 className="text-2xl font-bold text-dark-900 mb-2">Recevez votre étude personnalisée</h3>
            <p className="text-dark-500 mb-8">Un conseiller expert analysera votre projet et vous contactera sous 24h.</p>

            <div className="bg-primary-50 rounded-xl p-4 mb-8 flex flex-wrap gap-4 justify-between items-center">
              <div>
                <span className="text-sm text-primary-700">Votre simulation</span>
                <div className="flex flex-wrap gap-4 mt-1">
                  <span className="font-semibold text-primary-900">{results.puissanceRecommandee} kWc</span>
                  <span className="text-primary-600">•</span>
                  <span className="font-semibold text-primary-900">{formatCurrency(results.economiesAnnuelles)}/an</span>
                  {simInput.avecBatterie && <><span className="text-primary-600">•</span><span className="text-primary-700">+ Batterie {simInput.capaciteBatterie}kWh</span></>}
                  {simInput.avecBorne && <><span className="text-primary-600">•</span><span className="text-primary-700">+ Borne VE</span></>}
                </div>
              </div>
              <span className="text-2xl font-bold text-primary-600">{formatCurrency(results.coutNetApresAides)} *</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="prenom">Prénom *</label>
                  <input type="text" id="prenom" required value={formData.prenom} onChange={(e) => handleFormChange('prenom', e.target.value)} className="form-input" placeholder="Jean" />
                </div>
                <div>
                  <label className="form-label" htmlFor="nom">Nom *</label>
                  <input type="text" id="nom" required value={formData.nom} onChange={(e) => handleFormChange('nom', e.target.value)} className="form-input" placeholder="Dupont" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="email">Email *</label>
                  <input type="email" id="email" required value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} className="form-input" placeholder="jean.dupont@email.com" />
                </div>
                <div>
                  <label className="form-label" htmlFor="telephone">Téléphone *</label>
                  <input type="tel" id="telephone" required pattern="[0-9]{10}" value={formData.telephone} onChange={(e) => handleFormChange('telephone', e.target.value)} className="form-input" placeholder="06 XX XX XX XX" />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="codePostal">Code postal *</label>
                <input type="text" id="codePostal" required pattern="[0-9]{5}" maxLength={5} value={formData.codePostal} onChange={(e) => handleFormChange('codePostal', e.target.value)} className="form-input max-w-[200px]" placeholder="75001" />
                <p className="text-xs text-dark-400 mt-1">Pour identifier les installateurs certifiés RGE près de chez vous</p>
              </div>

              <div className="space-y-4 p-4 bg-dark-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consentement" checked={formData.consentement} onChange={(e) => handleFormChange('consentement', e.target.checked)} className="form-checkbox mt-1" required />
                  <label htmlFor="consentement" className="text-sm text-dark-600">
                    <span className="font-medium text-dark-800">J'accepte d'être recontacté(e)</span> par Pôle Énergie & Autonomie concernant mon projet d'installation énergétique. Je comprends que mes données seront traitées conformément à la <a href="/politique-confidentialite" className="text-primary-600 underline" target="_blank">politique de confidentialité</a>. *
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consentementPartenaires" checked={formData.consentementPartenaires} onChange={(e) => handleFormChange('consentementPartenaires', e.target.checked)} className="form-checkbox mt-1" />
                  <label htmlFor="consentementPartenaires" className="text-sm text-dark-600">
                    <span className="font-medium text-dark-800">J'accepte que mes coordonnées soient transmises</span> à des installateurs partenaires certifiés RGE de ma région afin de recevoir des devis comparatifs gratuits. Liste des partenaires disponible sur demande.
                  </label>
                </div>
              </div>

              {submitError && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{submitError}</div>}

              <button type="submit" disabled={isSubmitting || !formData.consentement} className={`btn-primary btn-lg w-full justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isSubmitting ? (
                  <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Envoi en cours...</>
                ) : (
                  <>Recevoir mon étude gratuite<svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></>
                )}
              </button>
              <p className="text-center text-xs text-dark-400">🔒 Vos données sont sécurisées et ne seront jamais revendues. Conformité RGPD garantie.</p>
            </form>
          </div>
        )}

        {step === 3 && submitSuccess && (
          <div className="p-6 md:p-10 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>

            <h3 className="text-2xl font-bold text-dark-900 mb-2">Demande envoyée avec succès !</h3>
            <p className="text-dark-500 mb-8 max-w-lg mx-auto">Merci <strong>{formData.prenom}</strong> ! Un conseiller expert de votre région vous contactera sous 24h ouvrées pour affiner votre projet.</p>

            <div className="bg-dark-50 rounded-2xl p-6 mb-8 max-w-lg mx-auto text-left">
              <h4 className="font-semibold text-dark-900 mb-4">Récapitulatif de votre projet</h4>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-dark-500">Installation recommandée</span><span className="font-semibold">{results.puissanceRecommandee} kWc</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Production annuelle estimée</span><span className="font-semibold">{formatNumber(results.productionAnnuelle)} kWh</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Économies annuelles</span><span className="font-semibold text-primary-600">{formatCurrency(results.economiesAnnuelles)}</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Investissement estimé (après aides)</span><span className="font-semibold">{formatCurrency(results.coutNetApresAides)}</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Retour sur investissement</span><span className="font-semibold text-solar-600">{results.tempsRetourInvestissement} ans</span></div>
                <div className="pt-3 border-t border-dark-200 flex justify-between"><span className="text-dark-700 font-medium">Gain net sur 25 ans</span><span className="font-bold text-xl text-primary-700">{formatCurrency(results.rentabiliteSur25Ans)}</span></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/blog" className="btn-secondary">Lire nos guides experts</a>
              <button type="button" onClick={() => { setStep(1); setFormData(initialFormData); setSubmitSuccess(false); }} className="btn-primary">Nouvelle simulation</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
