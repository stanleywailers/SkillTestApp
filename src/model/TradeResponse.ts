import React from "react";

export interface TradeResponse {
    data: TradeData[];
    type: string;
  }

interface TradeData {
    p: number;
    s: string;
    t: number;
    v: number;
  }
  
  