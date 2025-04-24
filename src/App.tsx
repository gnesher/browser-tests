import "./App.css";
import { ChipList, TooltipProvider } from "@redislabsdev/redis-ui-components";
import { theme } from '@redislabsdev/redis-ui-styles';
import { ThemeProvider } from "styled-components";

function App() {
  const chips = [
    { label: "Chip text", key: "chip id" },
    {
      label: "Another chip",
      key: "chip id 2",
      disabled: true,
      tooltip: "tooltip",
    },
  ];

  return (
    <>
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <ChipList chips={chips} onRemoveItem={(item) => console.log(item)} />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
