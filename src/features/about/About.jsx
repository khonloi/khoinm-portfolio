import React, { useState, useMemo, memo, useCallback } from "react";
import LayeredBox from "../../components/LayeredBox";
import winFolderIcon from "../../assets/icons/win-folder.ico";
import winFolderOpenDocumentIcon from "../../assets/icons/win-folder-open-document.ico";
import winDocumentsIcon from "../../assets/icons/win-documents.ico";
import { SKILLS_DATA } from "../../data/skills";

import winSwissArmyKnifeIcon from "../../assets/icons/win-swiss-army-knife.ico";
import winBriefcaseIcon from "../../assets/icons/win-briefcase.ico";

import { useAbout } from "./useAbout";
import { PortableText } from "@portabletext/react";
import { User } from "lucide-react";

const DEFAULT_ABOUT_DATA = {
  name: "User Name",
  tagline: "Professional Tagline",
  portraitUrl: null,
  aboutMe:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  experience: [
    {
      jobTitle: "Job Title",
      company: "Company Name",
      date: "Date Range",
      bullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      ],
    },
  ],
};

// Initial folder states
const INITIAL_FOLDER_STATES = SKILLS_DATA.reduce((acc, folder) => {
  acc[folder.id] = true;
  return acc;
}, {});

const About = memo(() => {
  const [openFolders, setOpenFolders] = useState(INITIAL_FOLDER_STATES);
  const { data: aboutData } = useAbout(DEFAULT_ABOUT_DATA);

  const toggleFolder = useCallback((folderId) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  }, []);

  const skillsSections = useMemo(
    () =>
      SKILLS_DATA.map((folder) => (
        <div key={folder.id} className="relative mb-4 before:absolute before:left-2.5 before:top-full before:z-0 before:w-px before:bg-windows-black before:content-['']">
          <div
            className="mb-2 flex cursor-[var(--cursor-link)] items-center gap-2 font-bold text-windows-blue"
            onClick={() => toggleFolder(folder.id)}
          >
            <img
              src={openFolders[folder.id] ? winFolderOpenDocumentIcon : winFolderIcon}
              alt="Folder"
              className="w-5"
            />{" "}
            {folder.title}
          </div>
          <div className="relative -mt-1 before:absolute before:left-2.5 before:h-[calc(100%-9.5px)] before:w-px before:bg-windows-black before:content-['']">
            {openFolders[folder.id] && (
              <ul className="ml-4 pl-2 text-sm">
                {folder.skills.map((skill, index) => (
                  <li key={`${folder.id}-${index}`} className="relative mb-2 flex items-center gap-2 pl-1 before:absolute before:-left-3.25 before:h-px before:w-2.5 before:bg-windows-black before:content-['']">
                    <img
                      src={winDocumentsIcon}
                      alt="Document"
                      className="w-5"
                    />{" "}
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div >
      )),
    [openFolders, toggleFolder]
  );

  return (
    <div className="flex h-132 w-full flex-col md:flex-row">
      {/* Left Pane - Skills Tree */}
      <div className="order-2 w-full border-t-2 border-windows-grey-dark bg-[#f2f2f2] p-4 md:order-none md:w-52 md:border-t-0 md:border-r-2 md:border-windows-grey-dark">{skillsSections}</div>

      {/* Right Pane - Main Content */}
      <div className="box-border overflow-y-visible p-4 pb-0 md:max-w-128 md:overflow-y-auto">
        <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
          {aboutData?.portraitUrl ? (
            <img src={aboutData.portraitUrl} alt="Portrait" className="w-16" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center border-2 border-windows-grey-dark bg-[#c0c0c0]">
              <User size={32} className="text-windows-grey-dark" />
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="m-0 mb-1 font-bold text-windows-black text-2xl">{aboutData?.name}</h2>
            <p className="m-0 text-windows-blue">{aboutData?.tagline}</p>
          </div>
        </div>
        <hr className="my-4 border-0 border-t-2 border-t-windows-grey border-b-2 border-b-windows-grey-dark" />
        <div className="mb-4">
          <h3 className="m-0 mb-4 flex items-center gap-2 font-bold text-lg">
            <img src={winSwissArmyKnifeIcon} alt="" className="w-6" />
            About Me
          </h3>
          <div className="space-y-4 leading-relaxed">
            {typeof aboutData?.aboutMe === "string" ? (
              aboutData.aboutMe.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : aboutData?.aboutMe ? (
              <PortableText value={aboutData.aboutMe} />
            ) : null}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="m-0 mb-4 flex items-center gap-2 font-bold text-lg">
            <img src={winBriefcaseIcon} alt="" className="w-6" />
            My Experience
          </h3>
          <div className="space-y-5">
            {aboutData?.experience?.map((exp, index) => (
              <LayeredBox
                key={index}
                variant="outward"
                bgColor="#f2f2f2"
                parentBgColor="#ffffff"
                className="mb-5"
              >
                <div className="p-3">
                  <div className="mb-1 font-bold">{exp.jobTitle}</div>
                  <div className="mb-2 text-windows-grey-dark">
                    {exp.company} • {exp.date}
                  </div>
                  <ul className="m-0 list-disc pl-5 leading-relaxed">
                    {exp.bullets?.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </LayeredBox>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

About.displayName = "About";

export default About;