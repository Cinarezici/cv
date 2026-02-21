"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin as LinkedinIcon,
  Briefcase,
  User,
  Book,
  Palette,
  Type,
} from "lucide-react";
import { Printer } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+90", name: "Türkiye" },
  { code: "+1", name: "ABD / Kanada" },
  { code: "+49", name: "Almanya" },
  { code: "+54", name: "Arjantin" },
  { code: "+61", name: "Avustralya" },
  { code: "+43", name: "Avusturya" },
  { code: "+971", name: "BAE" },
  { code: "+32", name: "Belçika" },
  { code: "+55", name: "Brezilya" },
  { code: "+86", name: "Çin" },
  { code: "+45", name: "Danimarka" },
  { code: "+358", name: "Finlandiya" },
  { code: "+33", name: "Fransa" },
  { code: "+27", name: "Güney Afrika" },
  { code: "+82", name: "Güney Kore" },
  { code: "+91", name: "Hindistan" },
  { code: "+31", name: "Hollanda" },
  { code: "+34", name: "İspanya" },
  { code: "+46", name: "İsveç" },
  { code: "+41", name: "İsviçre" },
  { code: "+39", name: "İtalya" },
  { code: "+81", name: "Japonya" },
  { code: "+57", name: "Kolombiya" },
  { code: "+52", name: "Meksika" },
  { code: "+20", name: "Mısır" },
  { code: "+47", name: "Norveç" },
  { code: "+48", name: "Polonya" },
  { code: "+7", name: "Rusya" },
  { code: "+56", name: "Şili" },
  { code: "+44", name: "İngiltere" },
  { code: "+64", name: "Yeni Zelanda" },
  { code: "+30", name: "Yunanistan" },
];

export default function ResumeViewer({
  data,
  initialAvatarUrl,
}: {
  data: any;
  initialAvatarUrl: string | null;
}) {
  const [name, setName] = useState(data.name || "Your Name");
  const [showPhoto, setShowPhoto] = useState(true);

  // Configurable state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [email, setEmail] = useState(data.email || "");

  // Extracted phone code if it exists.
  const rawPhone = data.phone || "";
  const likelyCodeMatch = rawPhone.match(/^(\+\d{1,3})\s*(.*)$/);
  const initialPhoneCode = likelyCodeMatch ? likelyCodeMatch[1] : "+90";
  const initialPhoneNum = likelyCodeMatch ? likelyCodeMatch[2] : rawPhone;

  const [phoneCode, setPhoneCode] = useState(initialPhoneCode);
  const [phone, setPhone] = useState(initialPhoneNum);
  const [location, setLocation] = useState(data.location || "");
  const [linkedin, setLinkedin] = useState(data.linkedin || "");

  // Theme Configurable State
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const [accentColor, setAccentColor] = useState("#10b981"); // Default Emerald 500
  const [sidebarColor, setSidebarColor] = useState("#1a1c23"); // Default Dark Zinc
  const [fontFamily, setFontFamily] = useState("Inter"); // Default Font

  const handlePrint = () => {
    window.print();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setShowPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-6 lg:py-12 px-2 sm:px-4 print:py-0 print:px-0 flex justify-center">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-10 w-full max-w-7xl mx-auto">
        {/* Responsive Control Panel (Hidden on Print) */}
        <div className="w-full max-w-[380px] shrink-0 bg-white rounded-xl shadow-lg border border-zinc-200 p-6 lg:p-8 flex flex-col gap-6 print:hidden lg:sticky top-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-zinc-100 pb-4 items-center">
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
              CV Dashboard
            </h2>
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div className="flex border border-zinc-200 rounded-lg p-1 bg-zinc-50 mb-2">
            <button
              className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${activeTab === "content" ? "bg-white shadow-sm text-zinc-900 border border-zinc-200" : "text-zinc-500 hover:text-zinc-700"}`}
              onClick={() => setActiveTab("content")}
            >
              <User className="w-4 h-4 inline-block mr-2 mb-0.5" /> Content
            </button>
            <button
              className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${activeTab === "design" ? "bg-white shadow-sm text-zinc-900 border border-zinc-200" : "text-zinc-500 hover:text-zinc-700"}`}
              onClick={() => setActiveTab("design")}
            >
              <Book className="w-4 h-4 inline-block mr-2 mb-0.5" /> Design
            </button>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {activeTab === "content" ? (
              <>
                {/* Prominent Profile Picture Block */}
                <div className="flex flex-col gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200 shadow-inner">
                  <h3 className="text-[13px] font-black text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                    📸 Profile Picture
                  </h3>

                  <div className="flex items-center gap-4 sm:gap-5">
                    {avatarUrl ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square min-w-[64px] sm:min-w-[80px] min-h-[64px] sm:min-h-[80px] flex-none rounded-full overflow-hidden border-2 border-indigo-200 shadow-md bg-white">
                        <img
                          src={avatarUrl}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square min-w-[64px] sm:min-w-[80px] min-h-[64px] sm:min-h-[80px] flex-none rounded-full border-2 border-zinc-300 bg-white flex items-center justify-center shadow-sm">
                        <span className="text-xl sm:text-2xl text-zinc-400 font-bold">
                          {name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5 flex-1">
                      <label className="cursor-pointer border-2 border-indigo-200 bg-indigo-50/50 rounded-lg py-2 text-center hover:bg-indigo-100 hover:border-indigo-300 transition-all w-full select-none">
                        <span className="text-sm font-bold text-indigo-700">
                          Upload New Photo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>

                      <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={showPhoto}
                            onChange={(e) => setShowPhoto(e.target.checked)}
                            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span className="text-[12px] sm:text-[13px] font-bold text-zinc-700">
                            Display on CV
                          </span>
                        </label>
                        {avatarUrl && (
                          <button
                            onClick={() => {
                              setAvatarUrl(null);
                              setShowPhoto(false);
                            }}
                            className="text-[11px] sm:text-[12px] font-bold text-rose-500 hover:text-rose-700 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-900 shadow-sm"
                      placeholder="..."
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-900 shadow-sm"
                      placeholder="..."
                    />
                  </div>
                </div>

                <hr className="border-t border-zinc-200 block" />

                {/* Secondary Contact */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                      Phone Number
                    </label>
                    <div className="flex gap-2 h-[42px]">
                      {/* BUGFIX: Added h-full to the relative container to prevent child collapse */}
                      <div className="relative w-[100px] shrink-0 h-full group">
                        <select
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.name} value={c.code}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-0 border border-zinc-300 rounded-lg bg-zinc-50 group-focus-within:ring-2 group-focus-within:ring-indigo-500 group-hover:bg-zinc-100 flex items-center justify-center text-sm text-zinc-800 font-bold pointer-events-none transition-all shadow-sm">
                          {phoneCode}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 w-full min-w-0 border border-zinc-300 rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-900 shadow-sm"
                        placeholder="..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-900 shadow-sm"
                      placeholder="..."
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-900 shadow-sm"
                      placeholder="..."
                    />
                  </div>
                </div>
              </>
            ) : activeTab === "design" ? (
              <div className="flex flex-col gap-6 w-full">
                {/* Color Picker Block */}
                <div className="flex flex-col gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200 shadow-inner">
                  <h3 className="text-[13px] font-black text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Colors
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-zinc-600">
                        Primary Accent
                      </span>
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-zinc-600">
                        Sidebar Background
                      </span>
                      <input
                        type="color"
                        value={sidebarColor}
                        onChange={(e) => setSidebarColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Block */}
                <div className="flex flex-col gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200 shadow-inner">
                  <h3 className="text-[13px] font-black text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-4 h-4" /> Typography
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="border border-zinc-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-900 shadow-sm"
                    >
                      <option value="Inter">Inter (Clean & Modern)</option>
                      <option value="Helvetica">Helvetica (Classic)</option>
                      <option value="Georgia">Georgia (Elegant Serif)</option>
                      <option value="Times New Roman">
                        Times New Roman (Academic)
                      </option>
                      <option value="Playfair Display">
                        Playfair Display (Executive)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Resume Canvas (A4 Size) */}
        <div
          className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none flex flex-row overflow-hidden rounded-xl print:rounded-none shrink-0"
          style={{
            minHeight: "297mm",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            fontFamily: fontFamily,
          }}
        >
          {/* Left Sidebar - Dark Theme */}
          <aside
            className="w-[32%] text-zinc-300 p-8 flex flex-col shrink-0"
            style={{ backgroundColor: sidebarColor }}
          >
            {/* Profile Picture */}
            {showPhoto && avatarUrl ? (
              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-zinc-700 shadow-xl bg-zinc-900">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : showPhoto ? (
              <div className="flex justify-center mb-8">
                <div className="w-40 h-40 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center shadow-xl">
                  <span className="text-5xl text-zinc-500 font-bold">
                    {name.charAt(0)}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Contact Info */}
            <div className="space-y-4 mb-10">
              {/* Only show Contact section if at least one contact detail exists */}
              {(email || phone || location || linkedin) && (
                <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100 border-b border-zinc-700 pb-2 mb-4">
                  Contact
                </h2>
              )}

              {email && (
                <div className="flex items-center gap-3 text-[13px] break-all">
                  <Mail
                    className="w-4 h-4 shrink-0"
                    style={{ color: accentColor }}
                  />
                  <span>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3 text-[13px]">
                  <Phone
                    className="w-4 h-4 shrink-0"
                    style={{ color: accentColor }}
                  />
                  <span>
                    {phoneCode} {phone}
                  </span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-3 text-[13px] mt-1">
                  <MapPin
                    className="w-4 h-4 shrink-0"
                    style={{ color: accentColor }}
                  />
                  <span>{location}</span>
                </div>
              )}
              {linkedin && (
                <div className="flex items-center gap-3 text-[13px] mt-1 break-all">
                  <LinkedinIcon
                    className="w-4 h-4 shrink-0"
                    style={{ color: accentColor }}
                  />
                  <span>
                    {linkedin
                      .replace("https://www.linkedin.com/in/", "")
                      .replace("https://linkedin.com/in/", "")}
                  </span>
                </div>
              )}
            </div>

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100 border-b border-zinc-700 pb-2 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="bg-zinc-800 text-zinc-300 text-[11px] px-3 py-1 rounded-sm border border-zinc-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 bg-white text-zinc-800 p-10 pt-12 flex flex-col">
            {/* Header */}
            <header className="mb-10">
              <h1 className="text-4xl font-black text-zinc-900 leading-tight tracking-tight uppercase">
                {name}
              </h1>
              {data.headline && (
                <div
                  className="mt-3 inline-block px-4 py-1.5 font-bold tracking-wide rounded text-sm uppercase"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  {data.headline}
                </div>
              )}
            </header>

            {/* Summary */}
            {data.summary && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-zinc-100 rounded-sm">
                    <User className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">
                    Profile
                  </h2>
                </div>
                <p className="text-[14px] leading-relaxed text-zinc-600 text-justify">
                  {data.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-zinc-100 rounded-sm">
                    <Briefcase className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">
                    Experience
                  </h2>
                </div>

                <div className="space-y-8">
                  {data.experience.map((exp: any, i: number) => (
                    <div
                      key={i}
                      className="relative pl-4 border-l-2 border-zinc-200"
                    >
                      <div
                        className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-zinc-900 text-[16px]">
                            {exp.title}
                          </h3>
                          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                            {exp.company}{" "}
                            {exp.location && (
                              <span className="text-zinc-400 capitalize">
                                | {exp.location}
                              </span>
                            )}
                          </p>
                        </div>
                        <span
                          className="text-[12px] font-bold px-2 py-1 rounded mt-1 sm:mt-0 whitespace-nowrap"
                          style={{
                            backgroundColor: `${accentColor}1A`,
                            color: accentColor,
                          }}
                        >
                          {exp.start_date} – {exp.end_date}
                        </span>
                      </div>

                      <ul className="mt-3 space-y-2">
                        {exp.bullets?.map((bullet: string, j: number) => (
                          <li
                            key={j}
                            className="text-[13px] text-zinc-600 leading-relaxed pl-4 relative before:content-['■'] before:absolute before:left-0 before:top-[4px] before:text-[8px] before:text-zinc-300"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-zinc-100 rounded-sm">
                    <Book className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">
                    Education
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {data.education.map((edu: any, i: number) => (
                    <div
                      key={i}
                      className="bg-zinc-50 p-4 rounded-lg border border-zinc-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-zinc-900 text-[14px]">
                            {edu.degree}
                          </h3>
                          <p className="text-[13px] text-zinc-500 mt-1">
                            {edu.school}
                          </p>
                        </div>
                        <span className="text-[12px] font-semibold text-zinc-400">
                          {edu.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
