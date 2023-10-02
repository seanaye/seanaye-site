use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse(md: &str) -> String {
    match markdown::to_html_with_options(md, &markdown::Options::gfm()) {
        Ok(s) => s,
        Err(s) => s
    }
}
