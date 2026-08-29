import React, { useState, useMemo, memo, useCallback } from "react";
import Button from "../../components/Button";
import LayeredBox from "../../components/LayeredBox";
import { WELCOME_CONTENT, MENU_ITEMS } from "../../data/welcomeContent";

import TreeIcon from "../../assets/icons/tree.ico";

const Welcome = memo(() => {
  const [activeSection, setActiveSection] = useState("welcome");

  const content = useMemo(
    () => WELCOME_CONTENT[activeSection] || null,
    [activeSection]
  );

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden box-border bg-windows-grey-shade-1 p-4 gap-3 md:gap-4 md:h-100 md:w-160">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <span className="font-['Noto_Serif',serif] text-3xl font-medium text-windows-black whitespace-nowrap">Welcome to </span>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <img src={TreeIcon} alt="Tree" className="w-10 h-10 shrink-0" />
          <h1 className="m-0 text-3xl font-bold text-windows-black">Pane 3.1</h1>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 flex-col gap-0 md:flex-row md:gap-4">
        <div className="flex flex-wrap flex-row justify-center md:justify-start mb-4 gap-4 md:flex-col md:gap-4 md:mb-0 md:m-1">
          {MENU_ITEMS.map((item) => (
            <Button
              key={item.id}
              isPressed={activeSection === item.id}
              onClick={() => handleSectionChange(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <LayeredBox
          variant="inward"
          bgColor="#f9f1a5"
          parentBgColor="#e0e0e0"
          className="flex flex-1 flex-col min-h-0 w-full max-h-[calc(100dvh-200px)] md:max-h-none [&_.layered-box-layer-1]:flex [&_.layered-box-layer-1]:flex-col [&_.layered-box-layer-1]:h-full [&_.layered-box-layer-3]:flex [&_.layered-box-layer-3]:flex-col [&_.layered-box-layer-3]:h-full [&_.layered-box-layer-3]:overflow-y-auto [&_.layered-box-layer-3]:p-4 [&_.layered-box-layer-3]:box-border [&_.layered-box-layer-3]:leading-relaxed [&_.layered-box-layer-3]:text-justify [&_p]:my-2"
        >
          {content}
        </LayeredBox>
      </div>
    </div>
  );
});

Welcome.displayName = "Welcome";

export default Welcome;
