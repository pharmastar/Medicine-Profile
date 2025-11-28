import React from 'react';
import { type DrugMonograph as DrugMonographType } from '../types';
import MonographSection from './MonographSection';
import { PillIcon, BookOpenIcon, ZapIcon, TargetIcon, AlertTriangleIcon, LinkIcon, DropletsIcon, GaugeIcon, FileTextIcon, BeakerIcon, BuildingIcon, ClipboardIcon, LibraryIcon, MessageCircleIcon } from './IconComponents';
// FIX: Import the DoseCalculator component to use it.
import DoseCalculator from './DoseCalculator';

interface DrugMonographProps {
  data: DrugMonographType;
  imageUrl: string | null;
  isLoadingImage: boolean;
}

const BulletList: React.FC<{ items: string[]; title?: string }> = ({ items, title }) => {
  if (!items || items.length === 0) return <p className="mt-4">{title ? `${title}: None reported.` : 'None reported.'}</p>;
  return (
    <div className="mt-4">
      {title && <p className="font-semibold text-gray-700">{title}</p>}
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const PathwayDiagram: React.FC<{ steps: string[] }> = ({ steps }) => {
    if (!steps || steps.length === 0) return <p>No pathway information available.</p>;
    return (
      <div className="flex flex-col items-center space-y-2 py-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="text-center bg-blue-50 border-2 border-blue-200 rounded-lg px-6 py-4 w-full md:w-3/4 shadow-sm">
                <p className="text-sm md:text-base">{step}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="text-blue-500 font-bold text-2xl" aria-hidden="true">
                  ↓
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
};


const DrugMonograph: React.FC<DrugMonographProps> = ({ data, imageUrl, isLoadingImage }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">{data.drugName}</h2>

      <MonographSection title="Introduction" icon={<BookOpenIcon />}>
        <div className="md:grid md:grid-cols-3 md:gap-8 items-center">
            <div className="md:col-span-1 mb-6 md:mb-0">
                {isLoadingImage ? (
                    <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ) : imageUrl ? (
                    <img src={imageUrl} alt={`Commercial formulation of ${data.drugName}`} className="w-full h-auto object-cover rounded-lg shadow-md"/>
                ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <p className="text-sm text-center">Image not available</p>
                    </div>
                )}
            </div>
            <div className="md:col-span-2">
                 <p>{data.introduction}</p>
            </div>
        </div>
      </MonographSection>
      
      <MonographSection title="Drug Class & Category" icon={<PillIcon />}>
          <p><strong className="text-gray-700">Pharmacological Class:</strong> {data.drugClassAndCategory.pharmacologicalClass}</p>
          <p><strong className="text-gray-700">Therapeutic Category:</strong> {data.drugClassAndCategory.therapeuticCategory}</p>
      </MonographSection>

      <MonographSection title="Mechanism of Action" icon={<ZapIcon />}>
        <PathwayDiagram steps={data.mechanismOfAction} />
      </MonographSection>

      <MonographSection title="Therapeutic Uses / Indications" icon={<TargetIcon />}>
        <BulletList title="FDA Approved" items={data.therapeuticUses.fdaApproved} />
        <BulletList title="Global Guidelines" items={data.therapeuticUses.globalGuidelines} />
        <BulletList title="Off-label" items={data.therapeuticUses.offLabel} />
      </MonographSection>
      
      <MonographSection title="Adverse Drug Reactions (ADRs)" icon={<AlertTriangleIcon />}>
        {data.adverseDrugReactions.blackBoxWarning && (
            <div className="border-l-4 border-black p-4 bg-gray-100 my-4">
                <p className="font-bold text-black">BLACK BOX WARNING</p>
                <p className="text-black">{data.adverseDrugReactions.blackBoxWarning}</p>
            </div>
        )}
        <BulletList title="Common" items={data.adverseDrugReactions.common} />
        <BulletList title="Serious" items={data.adverseDrugReactions.serious} />
        <BulletList title="Rare" items={data.adverseDrugReactions.rare} />
      </MonographSection>

      <MonographSection title="Interactions" icon={<LinkIcon />}>
        <BulletList title="Drug-Drug Interactions" items={data.interactions.drugDrug} />
        <BulletList title="Drug-Food Interactions" items={data.interactions.drugFood} />
        <BulletList title="Drug-Herbal Interactions" items={data.interactions.drugHerbal} />
      </MonographSection>

      <div className="grid md:grid-cols-2 gap-6">
        <MonographSection title="Pharmacokinetics (PK)" icon={<DropletsIcon />}>
          <p><strong className="text-gray-700">Absorption:</strong> {data.pharmacokinetics.absorption}</p>
          <p><strong className="text-gray-700">Distribution:</strong> {data.pharmacokinetics.distribution}</p>
          <p><strong className="text-gray-700">Metabolism:</strong> {data.pharmacokinetics.metabolism}</p>
          <p><strong className="text-gray-700">Excretion:</strong> {data.pharmacokinetics.excretion}</p>
          <p><strong className="text-gray-700">Half-life:</strong> {data.pharmacokinetics.halfLife}</p>
          <p><strong className="text-gray-700">Bioavailability:</strong> {data.pharmacokinetics.bioavailability}</p>
        </MonographSection>

        <MonographSection title="Pharmacodynamics (PD)" icon={<GaugeIcon />}>
           <BulletList items={data.pharmacodynamics.pathway} />
        </MonographSection>
      </div>
      
       <MonographSection title="Counselling Tips" icon={<MessageCircleIcon />}>
        <BulletList title="General Tips" items={data.counsellingTips.generalTips} />
        <div className="mt-4 space-y-2">
            <p><strong className="text-gray-700">When to Take:</strong> {data.counsellingTips.timeOfAdministration}</p>
            <p><strong className="text-gray-700">How to Take:</strong> {data.counsellingTips.vehicle}</p>
            <p><strong className="text-gray-700">With Food?:</strong> {data.counsellingTips.withFood}</p>
            <p><strong className="text-gray-700">Foods to Avoid:</strong> {data.counsellingTips.foodsToAvoid}</p>
        </div>
       </MonographSection>

      <MonographSection title="Dosage Information" icon={<FileTextIcon />}>
        <p><strong className="text-gray-700">Adult:</strong> {data.dosageInformation.adult}</p>
        <p><strong className="text-gray-700">Pediatric:</strong> {data.dosageInformation.pediatric}</p>
        <p><strong className="text-gray-700">Adjustments:</strong> {data.dosageInformation.adjustments}</p>
        {/* FIX: Integrate DoseCalculator component */}
        <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Individual Dose Calculator</h4>
            <DoseCalculator drugName={data.drugName} />
        </div>
      </MonographSection>

      <MonographSection title="Routes of Administration" icon={<BeakerIcon />}>
        <BulletList items={data.routesOfAdministration} />
      </MonographSection>

      <MonographSection title="Common Brands in Pakistan" icon={<BuildingIcon />}>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b-2">
                    <tr>
                        <th className="py-2 px-4 font-semibold text-gray-700">Brand Name</th>
                        <th className="py-2 px-4 font-semibold text-gray-700">Company</th>
                        <th className="py-2 px-4 font-semibold text-gray-700">Strengths/Forms</th>
                    </tr>
                </thead>
                <tbody>
                    {data.commonBrandsInPakistan.map((brand, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-2 px-4">{brand.brandName}</td>
                            <td className="py-2 px-4">{brand.company}</td>
                            <td className="py-2 px-4">{brand.strengths}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </MonographSection>

      <MonographSection title="Clinical Cases" icon={<ClipboardIcon />}>
        <div className="space-y-6">
            {data.clinicalCases && data.clinicalCases.length > 0 ? (
                data.clinicalCases.map((c, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50/50">
                        <p className="font-bold text-gray-800 mb-2">Case {index + 1}:</p>
                        <p className="mb-3">{c.case}</p>
                        <p className="font-bold text-blue-700 mb-2">Solution & Rationale:</p>
                        <p>{c.solution}</p>
                    </div>
                ))
            ) : (
                <p>No clinical cases available.</p>
            )}
        </div>
      </MonographSection>

      <MonographSection title="References" icon={<LibraryIcon />}>
        {data.references && data.references.length > 0 ? (
            <ol className="list-decimal list-inside space-y-1 text-sm">
                {data.references.map((ref, index) => (
                    <li key={index}>
                      <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {ref}
                      </a>
                    </li>
                ))}
            </ol>
        ) : (
            <p>No references provided.</p>
        )}
      </MonographSection>
    </div>
  );
};

export default DrugMonograph;