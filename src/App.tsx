import {
  MultiSelect,
  SelectOption,
  TooltipProvider,
} from "@redislabsdev/redis-ui-components";
import { theme } from "@redislabsdev/redis-ui-styles";
import { ThemeProvider } from "styled-components";

function App() {
  const options: SelectOption[] = [
    { value: "apple", label: "Apple" },
    { value: "orange", label: "Orange" },
    {
      value: "grape",
      label: "Grape (disabled)",
      disabled: true,
    },
  ];
  return (
    <>
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <div style={{ width: "300px" }}>
            <MultiSelect options={options} defaultValue={["orange"]} />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
