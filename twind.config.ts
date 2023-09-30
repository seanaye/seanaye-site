import { defineConfig, Preset } from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";
import presetTypography from "https://esm.sh/@twind/preset-typography";
import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix@1.0.7";

export default {
  ...defineConfig({
    presets: [presetTailwind(), presetTypography(), presetAutoprefix()],
  }),
  selfURL: import.meta.url,
};
