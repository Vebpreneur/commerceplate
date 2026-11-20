"use client";

import React, { useState, useId } from "react";
import {LuPlus,LuMinus} from "react-icons/lu";

const Accordion = ({
  title,
  children,
  className,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) => {
  const [show, setShow] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={`accordion pawlira-accordion ${show ? "active" : ""} ${className || ""}`}>
      <button className="accordion-header" type="button" aria-expanded={show} aria-controls={panelId} onClick={() => setShow(previous => !previous)}>
        <span className="accordion-title">{title}</span>
        {show?<LuMinus className="accordion-icon" size={19} strokeWidth={1.5}/>:<LuPlus className="accordion-icon" size={19} strokeWidth={1.5}/> }
      </button>
      <div id={panelId} className="accordion-content" hidden={!show}><div className="accordion-inner"><div>{children}</div></div></div>
    </div>
  );
};

export default Accordion;
