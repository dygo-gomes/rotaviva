import { useState, useEffect, useRef, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import * as d3 from "d3";

// ─── BRAND COLORS (Corpo de Bombeiros MIlitar do Paraná) ───
const COLORS = {
  azulEscuro: "#06273F",
  vermelho: "#D43439",
  amarelo: "#FFCD28",
  cinzaMedio: "#606062",
  cinzaQuente: "#A39F9B",
  branco: "#FEFEFE",
  pretoSuave: "#373435",
  bg: "#0B1D2E",
  bgCard: "#0E2640",
  bgCardLight: "#122F4E",
  textPrimary: "#F0F4F8",
  textSecondary: "#8FA4B8",
  border: "#1A3A56",
  gradientStart: "#06273F",
  gradientEnd: "#0E2640",
};

const LESAO_COLORS = {
  "Código 1 - Leves": "#FFCD28",
  "Código 2 - Graves s/ risco": "#FF8C42",
  "Código 3 - Graves c/ risco": "#D43439",
  "Código 4 - Óbito": "#8B0000",
  "Ileso(a)": "#4CAF50",
};

// ─── ALL DATA ───
const DATA = {"monthly":[{"Mes":"2025-04","total":306},{"Mes":"2025-05","total":359},{"Mes":"2025-06","total":328},{"Mes":"2025-07","total":336},{"Mes":"2025-08","total":330},{"Mes":"2025-09","total":355},{"Mes":"2025-10","total":325},{"Mes":"2025-11","total":296},{"Mes":"2025-12","total":273},{"Mes":"2026-01","total":185},{"Mes":"2026-02","total":164},{"Mes":"2026-03","total":262}],"bairros":[{"Bairro":"CIDADE INDUSTRIAL","total":292},{"Bairro":"SITIO CERCADO","total":189},{"Bairro":"PINHEIRINHO","total":168},{"Bairro":"BOQUEIRAO","total":160},{"Bairro":"CENTRO","total":141},{"Bairro":"UBERABA","total":133},{"Bairro":"XAXIM","total":119},{"Bairro":"PORTAO","total":95},{"Bairro":"AGUA VERDE","total":82},{"Bairro":"CAPAO RASO","total":80},{"Bairro":"REBOUCAS","total":75},{"Bairro":"TATUQUARA","total":73},{"Bairro":"BAIRRO ALTO","total":72},{"Bairro":"SANTA FELICIDADE","total":72},{"Bairro":"NOVO MUNDO","total":69},{"Bairro":"SANTA CANDIDA","total":66},{"Bairro":"MERCES","total":65},{"Bairro":"HAUER","total":63},{"Bairro":"CAJURU","total":62},{"Bairro":"ALTO DA RUA XV","total":59},{"Bairro":"OUTROS BAIRROS","total":1384}],"hourly":[{"Hora_int":0,"total":50},{"Hora_int":1,"total":36},{"Hora_int":2,"total":14},{"Hora_int":3,"total":4},{"Hora_int":4,"total":9},{"Hora_int":5,"total":21},{"Hora_int":6,"total":77},{"Hora_int":7,"total":224},{"Hora_int":8,"total":224},{"Hora_int":9,"total":141},{"Hora_int":10,"total":123},{"Hora_int":11,"total":159},{"Hora_int":12,"total":198},{"Hora_int":13,"total":231},{"Hora_int":14,"total":172},{"Hora_int":15,"total":195},{"Hora_int":16,"total":197},{"Hora_int":17,"total":259},{"Hora_int":18,"total":370},{"Hora_int":19,"total":222},{"Hora_int":20,"total":198},{"Hora_int":21,"total":162},{"Hora_int":22,"total":136},{"Hora_int":23,"total":97}],"dayOfWeek":[{"DiaSemana":0,"nome":"Segunda","total":472},{"DiaSemana":1,"nome":"Terça","total":542},{"DiaSemana":2,"nome":"Quarta","total":510},{"DiaSemana":3,"nome":"Quinta","total":524},{"DiaSemana":4,"nome":"Sexta","total":638},{"DiaSemana":5,"nome":"Sábado","total":521},{"DiaSemana":6,"nome":"Domingo","total":312}],"gender":[{"Genero":"Feminino","total":703},{"Genero":"Masculino","total":2816}],"ageGroups":[{"FaixaEtaria":"0-17","total":60},{"FaixaEtaria":"18-25","total":1274},{"FaixaEtaria":"26-35","total":1081},{"FaixaEtaria":"36-45","total":662},{"FaixaEtaria":"46-55","total":303},{"FaixaEtaria":"56-65","total":118},{"FaixaEtaria":"65+","total":19}],"lesao":[{"LesaoClean":"Código 2 - Graves s/ risco","total":1986},{"LesaoClean":"Código 1 - Leves","total":1301},{"LesaoClean":"Código 3 - Graves c/ risco","total":195},{"LesaoClean":"Ileso(a)","total":23},{"LesaoClean":"Código 4 - Óbito","total":14}],"heatmap":[{"DiaSemana":0,"Hora_int":0,"total":5,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":1,"total":4,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":4,"total":1,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":6,"total":14,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":7,"total":40,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":8,"total":32,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":9,"total":24,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":10,"total":17,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":11,"total":23,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":12,"total":29,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":13,"total":35,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":14,"total":24,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":15,"total":18,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":16,"total":29,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":17,"total":41,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":18,"total":44,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":19,"total":22,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":20,"total":26,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":21,"total":21,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":22,"total":15,"diaNome":"Segunda"},{"DiaSemana":0,"Hora_int":23,"total":8,"diaNome":"Segunda"},{"DiaSemana":1,"Hora_int":0,"total":3,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":1,"total":4,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":5,"total":8,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":6,"total":20,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":7,"total":36,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":8,"total":41,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":9,"total":32,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":10,"total":20,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":11,"total":23,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":12,"total":33,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":13,"total":24,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":14,"total":23,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":15,"total":31,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":16,"total":28,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":17,"total":44,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":18,"total":65,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":19,"total":23,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":20,"total":28,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":21,"total":19,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":22,"total":21,"diaNome":"Terça"},{"DiaSemana":1,"Hora_int":23,"total":16,"diaNome":"Terça"},{"DiaSemana":2,"Hora_int":0,"total":8,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":1,"total":3,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":2,"total":1,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":5,"total":2,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":6,"total":18,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":7,"total":43,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":8,"total":41,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":9,"total":18,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":10,"total":14,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":11,"total":15,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":12,"total":31,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":13,"total":31,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":14,"total":29,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":15,"total":25,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":16,"total":33,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":17,"total":39,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":18,"total":59,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":19,"total":30,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":20,"total":26,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":21,"total":17,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":22,"total":21,"diaNome":"Quarta"},{"DiaSemana":2,"Hora_int":23,"total":6,"diaNome":"Quarta"},{"DiaSemana":3,"Hora_int":0,"total":5,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":1,"total":2,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":2,"total":2,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":3,"total":1,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":4,"total":3,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":5,"total":1,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":6,"total":3,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":7,"total":34,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":8,"total":39,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":9,"total":19,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":10,"total":27,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":11,"total":22,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":12,"total":23,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":13,"total":49,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":14,"total":28,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":15,"total":31,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":16,"total":32,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":17,"total":46,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":18,"total":52,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":19,"total":46,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":20,"total":24,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":21,"total":16,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":22,"total":8,"diaNome":"Quinta"},{"DiaSemana":3,"Hora_int":23,"total":11,"diaNome":"Quinta"},{"DiaSemana":4,"Hora_int":0,"total":10,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":1,"total":1,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":5,"total":5,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":6,"total":9,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":7,"total":42,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":8,"total":41,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":9,"total":25,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":10,"total":24,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":11,"total":31,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":12,"total":30,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":13,"total":34,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":14,"total":21,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":15,"total":34,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":16,"total":40,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":17,"total":45,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":18,"total":65,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":19,"total":46,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":20,"total":40,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":21,"total":36,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":22,"total":32,"diaNome":"Sexta"},{"DiaSemana":4,"Hora_int":23,"total":27,"diaNome":"Sexta"},{"DiaSemana":5,"Hora_int":0,"total":11,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":1,"total":11,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":2,"total":6,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":3,"total":2,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":4,"total":2,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":5,"total":2,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":6,"total":7,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":7,"total":20,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":8,"total":17,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":9,"total":19,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":10,"total":14,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":11,"total":26,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":12,"total":29,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":13,"total":39,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":14,"total":35,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":15,"total":40,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":16,"total":22,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":17,"total":27,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":18,"total":56,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":19,"total":32,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":20,"total":32,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":21,"total":30,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":22,"total":27,"diaNome":"Sábado"},{"DiaSemana":5,"Hora_int":23,"total":15,"diaNome":"Sábado"},{"DiaSemana":6,"Hora_int":0,"total":8,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":1,"total":11,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":2,"total":5,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":3,"total":1,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":4,"total":3,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":5,"total":3,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":6,"total":6,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":7,"total":9,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":8,"total":13,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":9,"total":4,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":10,"total":7,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":11,"total":19,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":12,"total":23,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":13,"total":19,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":14,"total":12,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":15,"total":16,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":16,"total":13,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":17,"total":17,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":18,"total":29,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":19,"total":23,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":20,"total":22,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":21,"total":23,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":22,"total":12,"diaNome":"Domingo"},{"DiaSemana":6,"Hora_int":23,"total":14,"diaNome":"Domingo"}],"lesaoDia":[{"DiaSemana":0,"LesaoClean":"Código 1 - Leves","total":180,"diaNome":"Segunda"},{"DiaSemana":0,"LesaoClean":"Código 2 - Graves s/ risco","total":262,"diaNome":"Segunda"},{"DiaSemana":0,"LesaoClean":"Código 3 - Graves c/ risco","total":24,"diaNome":"Segunda"},{"DiaSemana":0,"LesaoClean":"Código 4 - Óbito","total":4,"diaNome":"Segunda"},{"DiaSemana":0,"LesaoClean":"Ileso(a)","total":2,"diaNome":"Segunda"},{"DiaSemana":1,"LesaoClean":"Código 1 - Leves","total":189,"diaNome":"Terça"},{"DiaSemana":1,"LesaoClean":"Código 2 - Graves s/ risco","total":325,"diaNome":"Terça"},{"DiaSemana":1,"LesaoClean":"Código 3 - Graves c/ risco","total":24,"diaNome":"Terça"},{"DiaSemana":1,"LesaoClean":"Ileso(a)","total":4,"diaNome":"Terça"},{"DiaSemana":2,"LesaoClean":"Código 1 - Leves","total":189,"diaNome":"Quarta"},{"DiaSemana":2,"LesaoClean":"Código 2 - Graves s/ risco","total":287,"diaNome":"Quarta"},{"DiaSemana":2,"LesaoClean":"Código 3 - Graves c/ risco","total":29,"diaNome":"Quarta"},{"DiaSemana":2,"LesaoClean":"Código 4 - Óbito","total":1,"diaNome":"Quarta"},{"DiaSemana":2,"LesaoClean":"Ileso(a)","total":4,"diaNome":"Quarta"},{"DiaSemana":3,"LesaoClean":"Código 1 - Leves","total":189,"diaNome":"Quinta"},{"DiaSemana":3,"LesaoClean":"Código 2 - Graves s/ risco","total":299,"diaNome":"Quinta"},{"DiaSemana":3,"LesaoClean":"Código 3 - Graves c/ risco","total":29,"diaNome":"Quinta"},{"DiaSemana":3,"LesaoClean":"Código 4 - Óbito","total":2,"diaNome":"Quinta"},{"DiaSemana":3,"LesaoClean":"Ileso(a)","total":5,"diaNome":"Quinta"},{"DiaSemana":4,"LesaoClean":"Código 1 - Leves","total":232,"diaNome":"Sexta"},{"DiaSemana":4,"LesaoClean":"Código 2 - Graves s/ risco","total":360,"diaNome":"Sexta"},{"DiaSemana":4,"LesaoClean":"Código 3 - Graves c/ risco","total":37,"diaNome":"Sexta"},{"DiaSemana":4,"LesaoClean":"Código 4 - Óbito","total":5,"diaNome":"Sexta"},{"DiaSemana":4,"LesaoClean":"Ileso(a)","total":4,"diaNome":"Sexta"},{"DiaSemana":5,"LesaoClean":"Código 1 - Leves","total":186,"diaNome":"Sábado"},{"DiaSemana":5,"LesaoClean":"Código 2 - Graves s/ risco","total":305,"diaNome":"Sábado"},{"DiaSemana":5,"LesaoClean":"Código 3 - Graves c/ risco","total":27,"diaNome":"Sábado"},{"DiaSemana":5,"LesaoClean":"Código 4 - Óbito","total":1,"diaNome":"Sábado"},{"DiaSemana":5,"LesaoClean":"Ileso(a)","total":2,"diaNome":"Sábado"},{"DiaSemana":6,"LesaoClean":"Código 1 - Leves","total":136,"diaNome":"Domingo"},{"DiaSemana":6,"LesaoClean":"Código 2 - Graves s/ risco","total":148,"diaNome":"Domingo"},{"DiaSemana":6,"LesaoClean":"Código 3 - Graves c/ risco","total":25,"diaNome":"Domingo"},{"DiaSemana":6,"LesaoClean":"Código 4 - Óbito","total":1,"diaNome":"Domingo"},{"DiaSemana":6,"LesaoClean":"Ileso(a)","total":2,"diaNome":"Domingo"}],"tipoDia":[{"TipoDia":"Dia Útil","total":2686},{"TipoDia":"Fim de Semana","total":833}],"summary":{"totalOcorrencias":3178,"totalVitimas":3519,"totalBairros":75,"totalObitos":14,"idadeMedia":31.6,"horaPico":18,"bairroPico":"CIDADE INDUSTRIAL","periodo":"Abril 2025 - Março 2026"},"genderAge":[{"Genero":"Feminino","FaixaEtaria":"0-17","total":18},{"Genero":"Feminino","FaixaEtaria":"18-25","total":248},{"Genero":"Feminino","FaixaEtaria":"26-35","total":237},{"Genero":"Feminino","FaixaEtaria":"36-45","total":118},{"Genero":"Feminino","FaixaEtaria":"46-55","total":61},{"Genero":"Feminino","FaixaEtaria":"56-65","total":17},{"Genero":"Feminino","FaixaEtaria":"65+","total":4},{"Genero":"Masculino","FaixaEtaria":"0-17","total":42},{"Genero":"Masculino","FaixaEtaria":"18-25","total":1026},{"Genero":"Masculino","FaixaEtaria":"26-35","total":844},{"Genero":"Masculino","FaixaEtaria":"36-45","total":544},{"Genero":"Masculino","FaixaEtaria":"46-55","total":242},{"Genero":"Masculino","FaixaEtaria":"56-65","total":101},{"Genero":"Masculino","FaixaEtaria":"65+","total":15}]};

// ─── COMPONENTS ───

const StatCard = ({ label, value, sub, icon, color = COLORS.vermelho }) => (
  <div style={{
    background: `linear-gradient(135deg, ${COLORS.bgCard} 0%, ${COLORS.bgCardLight} 100%)`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: "20px 24px",
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: -10, right: -10, fontSize: 64, opacity: 0.06, color }}>{icon}</div>
    <div style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
    <div style={{ fontSize: 36, fontWeight: 800, color: COLORS.textPrimary, marginTop: 4, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color, fontWeight: 600, marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 20, marginTop: 40 }}>
    <h2 style={{
      fontSize: 22,
      fontWeight: 800,
      color: COLORS.textPrimary,
      margin: 0,
      fontFamily: "'Bebas Neue', sans-serif",
      letterSpacing: 2,
      textTransform: "uppercase",
      borderLeft: `4px solid ${COLORS.vermelho}`,
      paddingLeft: 14,
    }}>{children}</h2>
    {sub && <p style={{ color: COLORS.textSecondary, fontSize: 13, margin: "6px 0 0 18px" }}>{sub}</p>}
  </div>
);

const Card = ({ children, style }) => (
  <div style={{
    background: `linear-gradient(145deg, ${COLORS.bgCard}, ${COLORS.bgCardLight})`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 24,
    ...style,
  }}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: COLORS.azulEscuro,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}>
      <div style={{ color: COLORS.textSecondary, fontSize: 11, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || COLORS.amarelo, fontSize: 14, fontWeight: 700 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

// ─── HEATMAP COMPONENT ───
const HeatmapChart = () => {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const daysFull = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dataMap = {};
  DATA.heatmap.forEach(d => { dataMap[`${d.DiaSemana}-${d.Hora_int}`] = d.total; });
  const maxVal = Math.max(...DATA.heatmap.map(d => d.total));

  const getColor = (val) => {
    if (!val) return COLORS.bgCard;
    const t = val / maxVal;
    if (t < 0.25) return "#122F4E";
    if (t < 0.5) return "#FFCD2844";
    if (t < 0.75) return "#FF8C42AA";
    return COLORS.vermelho;
  };

  const cellSize = 32;
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "inline-grid", gridTemplateColumns: `60px repeat(24, ${cellSize}px)`, gap: 2, alignItems: "center" }}>
        <div />
        {hours.map(h => (
          <div key={h} style={{ textAlign: "center", fontSize: 10, color: COLORS.textSecondary, fontWeight: 600 }}>
            {String(h).padStart(2, "0")}h
          </div>
        ))}
        {days.map((day, di) => (
          <>
            <div key={`label-${di}`} style={{ fontSize: 12, color: COLORS.textPrimary, fontWeight: 700, textAlign: "right", paddingRight: 8 }}>{day}</div>
            {hours.map(h => {
              const val = dataMap[`${di}-${h}`] || 0;
              const isHov = hovered === `${di}-${h}`;
              return (
                <div
                  key={`${di}-${h}`}
                  onMouseEnter={() => setHovered(`${di}-${h}`)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: cellSize, height: cellSize,
                    background: getColor(val),
                    borderRadius: 4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: val > maxVal * 0.5 ? "#fff" : COLORS.textSecondary,
                    fontWeight: val > maxVal * 0.5 ? 700 : 400,
                    cursor: "pointer",
                    transform: isHov ? "scale(1.2)" : "scale(1)",
                    transition: "transform 0.15s ease",
                    zIndex: isHov ? 10 : 1,
                    position: "relative",
                    border: isHov ? `2px solid ${COLORS.amarelo}` : "1px solid transparent",
                  }}
                  title={`${daysFull[di]} ${String(h).padStart(2, "0")}h: ${val} ocorrências`}
                >
                  {val > 0 ? val : ""}
                </div>
              );
            })}
          </>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, justifyContent: "center" }}>
        <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Menos</span>
        {["#122F4E", "#FFCD2844", "#FF8C42AA", COLORS.vermelho].map((c, i) => (
          <div key={i} style={{ width: 24, height: 12, background: c, borderRadius: 3 }} />
        ))}
        <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Mais</span>
      </div>
    </div>
  );
};

// ─── ANIMATED HOURLY SLIDER ───
const HourlySlider = () => {
  const [hour, setHour] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setHour(prev => {
          if (prev >= 23) { setPlaying(false); return 23; }
          return prev + 1;
        });
      }, 600);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const cumulativeData = useMemo(() => {
    return DATA.hourly.filter(d => d.Hora_int <= hour).reduce((acc, d) => acc + d.total, 0);
  }, [hour]);

  const barData = DATA.hourly.map(d => ({
    ...d,
    hora: `${String(d.Hora_int).padStart(2, "0")}h`,
    active: d.Hora_int <= hour,
  }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <button
          onClick={() => { if (hour >= 23) setHour(0); setPlaying(!playing); }}
          style={{
            background: playing ? COLORS.vermelho : COLORS.amarelo,
            color: playing ? "#fff" : COLORS.azulEscuro,
            border: "none", borderRadius: 8, padding: "8px 20px",
            fontWeight: 800, fontSize: 13, cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5,
          }}
        >
          {playing ? "⏸ PAUSAR" : "▶ REPRODUZIR"}
        </button>
        <input
          type="range" min={0} max={23} value={hour}
          onChange={e => { setPlaying(false); setHour(+e.target.value); }}
          style={{ flex: 1, accentColor: COLORS.vermelho }}
        />
        <div style={{
          background: COLORS.vermelho, borderRadius: 8, padding: "6px 16px",
          fontWeight: 800, fontSize: 22, color: "#fff",
          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, minWidth: 60, textAlign: "center",
        }}>
          {String(hour).padStart(2, "0")}h
        </div>
        <div style={{ color: COLORS.amarelo, fontWeight: 700, fontSize: 14, minWidth: 120 }}>
          Acumulado: {cumulativeData}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="hora" tick={{ fill: COLORS.textSecondary, fontSize: 10 }} />
          <YAxis tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" name="Vítimas" radius={[4, 4, 0, 0]}>
            {barData.map((entry, i) => (
              <Cell key={i} fill={entry.active ? COLORS.vermelho : COLORS.border} opacity={entry.active ? 1 : 0.3} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── LESAO × DIA TABLE ───
const LesaoDiaTable = () => {
  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const lesaoTypes = ["Código 1 - Leves", "Código 2 - Graves s/ risco", "Código 3 - Graves c/ risco", "Código 4 - Óbito", "Ileso(a)"];
  const dataMap = {};
  DATA.lesaoDia.forEach(d => { dataMap[`${d.diaNome}-${d.LesaoClean}`] = d.total; });

  const cellStyle = (val, lesao) => ({
    padding: "8px 6px", textAlign: "center", fontSize: 13, fontWeight: 600,
    color: lesao.includes("Óbito") && val > 0 ? "#fff" : COLORS.textPrimary,
    background: val > 0 ? (lesao.includes("Óbito") ? "#8B000066" : "transparent") : "transparent",
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${COLORS.vermelho}` }}>
            <th style={{ padding: 8, textAlign: "left", color: COLORS.textSecondary, fontWeight: 700 }}>Grau de Lesão</th>
            {dias.map(d => <th key={d} style={{ padding: 8, textAlign: "center", color: COLORS.textSecondary, fontWeight: 700 }}>{d.slice(0, 3)}</th>)}
            <th style={{ padding: 8, textAlign: "center", color: COLORS.amarelo, fontWeight: 700 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {lesaoTypes.map((lesao, i) => {
            const rowTotal = dias.reduce((sum, d) => sum + (dataMap[`${d}-${lesao}`] || 0), 0);
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: 8, color: LESAO_COLORS[lesao], fontWeight: 700, fontSize: 11 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: LESAO_COLORS[lesao], marginRight: 6 }} />
                  {lesao}
                </td>
                {dias.map(d => <td key={d} style={cellStyle(dataMap[`${d}-${lesao}`] || 0, lesao)}>{dataMap[`${d}-${lesao}`] || 0}</td>)}
                <td style={{ padding: 8, textAlign: "center", color: COLORS.amarelo, fontWeight: 800, fontSize: 14 }}>{rowTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── BAIRRO TABLE ───
const BairroTable = () => {
  const maxBairro = DATA.bairros[0].total;
  return (
    <div style={{ maxHeight: 480, overflowY: "auto" }}>
      {DATA.bairros.map((b, i) => {
        const pct = (b.total / maxBairro) * 100;
        const isOutros = b.Bairro === "OUTROS BAIRROS";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}22` }}>
            <div style={{
              minWidth: 28, height: 28, borderRadius: 6,
              background: isOutros ? COLORS.cinzaMedio : (i < 3 ? COLORS.vermelho : COLORS.azulEscuro),
              border: `1px solid ${COLORS.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff",
            }}>{isOutros ? "..." : i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: isOutros ? COLORS.cinzaQuente : COLORS.textPrimary }}>{b.Bairro}</div>
              <div style={{ height: 4, borderRadius: 2, background: COLORS.border, marginTop: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: isOutros ? COLORS.cinzaMedio : `linear-gradient(90deg, ${COLORS.vermelho}, ${COLORS.amarelo})`,
                  borderRadius: 2,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.amarelo, minWidth: 40, textAlign: "right" }}>{b.total}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── PYRAMID CHART (Gender × Age) ───
const GenderAgePyramid = () => {
  const ages = ["0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "65+"];
  const dataMap = {};
  DATA.genderAge.forEach(d => { dataMap[`${d.Genero}-${d.FaixaEtaria}`] = d.total; });
  const maxVal = Math.max(...DATA.genderAge.map(d => d.total));

  return (
    <div>
      {ages.map((age, i) => {
        const m = dataMap[`Masculino-${age}`] || 0;
        const f = dataMap[`Feminino-${age}`] || 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
            <div style={{ width: 50, textAlign: "right", fontSize: 11, color: COLORS.textSecondary, fontWeight: 600 }}>{m}</div>
            <div style={{ flex: 1, height: 20, display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                width: `${(m / maxVal) * 100}%`, height: "100%",
                background: `linear-gradient(270deg, ${COLORS.azulEscuro}, #1565C0)`,
                borderRadius: "4px 0 0 4px",
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{
              width: 50, textAlign: "center", fontSize: 11, fontWeight: 800,
              color: COLORS.textPrimary, background: COLORS.border, borderRadius: 4, padding: "2px 0",
            }}>{age}</div>
            <div style={{ flex: 1, height: 20 }}>
              <div style={{
                width: `${(f / maxVal) * 100}%`, height: "100%",
                background: `linear-gradient(90deg, ${COLORS.vermelho}, #E57373)`,
                borderRadius: "0 4px 4px 0",
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ width: 50, textAlign: "left", fontSize: 11, color: COLORS.textSecondary, fontWeight: 600 }}>{f}</div>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "#1565C0" }} />
          <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 600 }}>Masculino</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.vermelho }} />
          <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 600 }}>Feminino</span>
        </div>
      </div>
    </div>
  );
};

const mesLabel = (m) => {
  const [y, mm] = m.split("-");
  const meses = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${meses[+mm]}/${y.slice(2)}`;
};

// ─── MAIN DASHBOARD ───
export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("resumo");

  const monthlyFormatted = DATA.monthly.map(d => ({ ...d, label: mesLabel(d.Mes) }));

  const nav = [
    { id: "resumo", label: "Resumo" },
    { id: "temporal", label: "Temporal" },
    { id: "bairros", label: "Bairros" },
    { id: "perfil", label: "Perfil" },
    { id: "lesao", label: "Lesões" },
  ];

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: COLORS.textPrimary,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line { stroke: ${COLORS.border}; }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.azulEscuro} 0%, #0A1F33 50%, ${COLORS.azulEscuro} 100%)`,
        borderBottom: `3px solid ${COLORS.vermelho}`,
        padding: "28px 32px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: COLORS.vermelho,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "#fff",
            boxShadow: "0 4px 16px rgba(212,52,57,0.4)",
          }}>🏍️</div>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 800,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: 3,
              color: "#fff",
              textTransform: "uppercase",
            }}>
              Painel de Acidentes de Motos — Curitiba
            </h1>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>
              Corpo de Bombeiros Militar do Paraná • 1º Batalhão de Bombeiro Militar • {DATA.summary.periodo}
            </div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{
        display: "flex", gap: 4, padding: "12px 32px",
        background: COLORS.bgCard,
        borderBottom: `1px solid ${COLORS.border}`,
        overflowX: "auto",
      }}>
        {nav.map(n => (
          <button
            key={n.id}
            onClick={() => setActiveSection(n.id)}
            style={{
              background: activeSection === n.id ? COLORS.vermelho : "transparent",
              color: activeSection === n.id ? "#fff" : COLORS.textSecondary,
              border: `1px solid ${activeSection === n.id ? COLORS.vermelho : COLORS.border}`,
              borderRadius: 8, padding: "8px 20px",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: 1.5,
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ─── RESUMO ─── */}
        {activeSection === "resumo" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <StatCard label="Total de Ocorrências" value={DATA.summary.totalOcorrencias.toLocaleString("pt-BR")} icon="🚨" color={COLORS.vermelho} />
              <StatCard label="Total de Vítimas" value={DATA.summary.totalVitimas.toLocaleString("pt-BR")} icon="🏥" color={COLORS.amarelo} />
              <StatCard label="Óbitos" value={DATA.summary.totalObitos} sub="0,40% das vítimas" icon="⚠" color="#8B0000" />
              <StatCard label="Bairros Afetados" value={DATA.summary.totalBairros} icon="📍" color={COLORS.cinzaQuente} />
              <StatCard label="Idade Média" value={`${DATA.summary.idadeMedia} anos`} icon="👤" color="#1565C0" />
              <StatCard label="Horário Pico" value={`${DATA.summary.horaPico}h`} sub="Maior concentração" icon="🕐" color={COLORS.vermelho} />
            </div>

            <SectionTitle sub="Evolução mensal de vítimas no período">Visão Geral — 12 Meses</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyFormatted} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.vermelho} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={COLORS.vermelho} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="label" tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
                  <YAxis tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" name="Vítimas" stroke={COLORS.vermelho} strokeWidth={3} fill="url(#gradArea)" dot={{ fill: COLORS.vermelho, r: 5, strokeWidth: 2, stroke: COLORS.bgCard }} activeDot={{ r: 7 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <SectionTitle sub="Distribuição por tipo de lesão">Gravidade das Lesões</SectionTitle>
            <Card>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie data={DATA.lesao} dataKey="total" nameKey="LesaoClean" innerRadius={50} outerRadius={95} paddingAngle={3} strokeWidth={0}>
                      {DATA.lesao.map((d, i) => <Cell key={i} fill={LESAO_COLORS[d.LesaoClean] || COLORS.cinzaMedio} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, minWidth: 240 }}>
                  {DATA.lesao.map((d, i) => {
                    const pct = ((d.total / DATA.summary.totalVitimas) * 100).toFixed(1);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: LESAO_COLORS[d.LesaoClean], flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 12, color: COLORS.textPrimary }}>{d.LesaoClean}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.amarelo }}>{d.total}</div>
                        <div style={{ fontSize: 11, color: COLORS.textSecondary, minWidth: 40 }}>({pct}%)</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ─── TEMPORAL ─── */}
        {activeSection === "temporal" && (
          <>
            <SectionTitle sub="Arraste o slider ou clique em Reproduzir para animar">Ocorrências por Hora — Animado</SectionTitle>
            <Card><HourlySlider /></Card>

            <SectionTitle sub="Dia da semana × Hora do dia">Mapa de Calor</SectionTitle>
            <Card><HeatmapChart /></Card>

            <SectionTitle sub="Volume de vítimas por dia da semana">Dia da Semana</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={DATA.dayOfWeek} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="nome" tick={{ fill: COLORS.textSecondary, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Vítimas" radius={[6, 6, 0, 0]}>
                    {DATA.dayOfWeek.map((d, i) => (
                      <Cell key={i} fill={d.DiaSemana >= 5 ? COLORS.amarelo : COLORS.vermelho} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.vermelho }} />
                  <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Dia Útil ({DATA.tipoDia[0].total} vítimas)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.amarelo }} />
                  <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Fim de Semana ({DATA.tipoDia[1].total} vítimas)</span>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* ─── BAIRROS ─── */}
        {activeSection === "bairros" && (
          <>
            <SectionTitle sub="Top 20 bairros + agrupamento dos demais">Ranking de Ocorrências por Bairro</SectionTitle>
            <Card><BairroTable /></Card>

            <SectionTitle sub="Top 10 bairros em formato gráfico">Comparativo Visual</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={DATA.bairros.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
                  <YAxis dataKey="Bairro" type="category" tick={{ fill: COLORS.textPrimary, fontSize: 11, fontWeight: 600 }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Vítimas" radius={[0, 6, 6, 0]}>
                    {DATA.bairros.slice(0, 10).map((_, i) => (
                      <Cell key={i} fill={i < 3 ? COLORS.vermelho : i < 6 ? COLORS.amarelo : COLORS.cinzaMedio} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}

        {/* ─── PERFIL ─── */}
        {activeSection === "perfil" && (
          <>
            <SectionTitle sub="Pirâmide etária segmentada por gênero">Gênero × Faixa Etária</SectionTitle>
            <Card><GenderAgePyramid /></Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
              <div>
                <SectionTitle sub="Distribuição por faixa etária">Faixas Etárias</SectionTitle>
                <Card>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={DATA.ageGroups} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                      <XAxis dataKey="FaixaEtaria" tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
                      <YAxis tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="total" name="Vítimas" radius={[6, 6, 0, 0]} fill={COLORS.vermelho}>
                        {DATA.ageGroups.map((_, i) => (
                          <Cell key={i} fill={i <= 1 ? COLORS.vermelho : i <= 3 ? COLORS.amarelo : COLORS.cinzaMedio} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <div>
                <SectionTitle sub="Proporção Masculino vs Feminino">Gênero</SectionTitle>
                <Card>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={DATA.gender} dataKey="total" nameKey="Genero" innerRadius={55} outerRadius={90} paddingAngle={4} strokeWidth={0}>
                          <Cell fill="#1565C0" />
                          <Cell fill={COLORS.vermelho} />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
                      {DATA.gender.map((g, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 28, fontWeight: 800, color: i === 1 ? "#1565C0" : COLORS.vermelho, fontFamily: "'Bebas Neue', sans-serif" }}>{((g.total / DATA.summary.totalVitimas) * 100).toFixed(1)}%</div>
                          <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{g.Genero} ({g.total})</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* ─── LESÕES ─── */}
        {activeSection === "lesao" && (
          <>
            <SectionTitle sub="Cruzamento entre grau de lesão e dia da semana">Grau de Lesão × Dia da Semana</SectionTitle>
            <Card><LesaoDiaTable /></Card>

            <SectionTitle sub="Distribuição de lesões por hora do dia">Grau de Lesão × Horário</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={Array.from({ length: 24 }, (_, h) => {
                    const obj = { hora: `${String(h).padStart(2, "0")}h` };
                    Object.keys(LESAO_COLORS).forEach(l => { obj[l] = 0; });
                    DATA.heatmap.forEach(() => {}); // placeholder
                    return obj;
                  }).map((obj, h) => {
                    const items = DATA.lesao.map(l => l.LesaoClean);
                    items.forEach(l => {
                      const found = (DATA.lesaoHora || []).find(d => d && d.Hora_int === h && d.LesaoClean === l);
                      obj[l] = found ? found.total : 0;
                    });
                    return obj;
                  })}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="hora" tick={{ fill: COLORS.textSecondary, fontSize: 9 }} />
                  <YAxis tick={{ fill: COLORS.textSecondary, fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, color: COLORS.textSecondary }} />
                  {Object.entries(LESAO_COLORS).map(([key, color]) => (
                    <Bar key={key} dataKey={key} stackId="a" fill={color} name={key.replace("Código ", "Cód. ")} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <SectionTitle sub="Visão geral das lesões">Resumo de Gravidade</SectionTitle>
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                {DATA.lesao.map((d, i) => {
                  const pct = ((d.total / DATA.summary.totalVitimas) * 100).toFixed(1);
                  return (
                    <div key={i} style={{
                      background: COLORS.bg,
                      borderRadius: 12,
                      padding: 16,
                      borderLeft: `4px solid ${LESAO_COLORS[d.LesaoClean]}`,
                    }}>
                      <div style={{ fontSize: 11, color: LESAO_COLORS[d.LesaoClean], fontWeight: 700, marginBottom: 4 }}>{d.LesaoClean}</div>
                      <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.textPrimary, fontFamily: "'Bebas Neue', sans-serif" }}>{d.total}</div>
                      <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{pct}% do total</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* FOOTER */}
        <div style={{
          marginTop: 48, paddingTop: 20,
          borderTop: `2px solid ${COLORS.vermelho}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ fontSize: 11, color: COLORS.textSecondary }}>
            Corpo de Bombeiros Militar do Paraná — Nós Salvamos Vidas
          </div>
          <div style={{ fontSize: 11, color: COLORS.textSecondary }}>
            Dados: Planilha de Ocorrências 1ºBBM • Período: {DATA.summary.periodo}
          </div>
        </div>
      </div>
    </div>
  );
}
