use std::{
    mem,
    ops::{Add, Index, IndexMut},
};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[derive(Clone)]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

impl Index<usize> for Universe {
    type Output = Cell;
    fn index(&self, index: usize) -> &Cell {
        self.cells.index(index)
    }
}

impl IndexMut<usize> for Universe {
    fn index_mut(&mut self, index: usize) -> &mut Cell {
        self.cells.index_mut(index)
    }
}

impl Index<&Coord> for Universe {
    type Output = Cell;
    fn index(&self, coord: &Coord) -> &Cell {
        self.index(self.to_index(coord))
    }
}

impl IndexMut<&Coord> for Universe {
    fn index_mut(&mut self, coord: &Coord) -> &mut Cell {
        self.index_mut(self.to_index(coord))
    }
}

#[derive(Clone, Copy)]
pub struct Coord {
    x: i32,
    y: i32,
}

impl Add for &Coord {
    type Output = Coord;
    fn add(self, other: &Coord) -> Coord {
        Coord {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

const PERMS: [Coord; 8] = [
    Coord { x: 0, y: 1 },
    Coord { x: 1, y: 1 },
    Coord { x: 1, y: 0 },
    Coord { x: 1, y: -1 },
    Coord { x: 0, y: -1 },
    Coord { x: -1, y: -1 },
    Coord { x: -1, y: 0 },
    Coord { x: -1, y: 1 },
];

impl Universe {
    pub fn length(&self) -> usize {
        self.cells.len()
    }

    fn to_index(&self, coord: &Coord) -> usize {
        let mut m = *coord;
        if m.x < 0i32 {
            m.x = self.width as i32 - 1;
        }
        if m.x >= self.width as i32 {
            m.x = 0;
        }
        if m.y < 0i32 {
            m.y = self.height as i32 - 1;
        }
        if m.y >= self.height as i32 {
            m.y = 0;
        }
        (m.y as u32 * self.width + m.x as u32) as usize
    }

    fn alive_neighbours(&self, coord: &Coord) -> u8 {
        PERMS
            .iter()
            .filter_map(|p| {
                let new_coord = coord + p;
                match self.index(&new_coord) {
                    Cell::Alive => Some(true),
                    Cell::Dead => None,
                }
            })
            .count() as u8
    }

    pub fn tick(&self) -> Universe {
        let mut next = self.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let coord = Coord {
                    x: col as i32,
                    y: row as i32,
                };

                let live_neighbours = self.alive_neighbours(&coord);

                let next_cell = match live_neighbours {
                    x if x < 2 => Some(Cell::Dead),
                    3 => Some(Cell::Alive),
                    x if x > 3 => Some(Cell::Dead),
                    _ => None,
                };

                if let Some(n) = next_cell {
                    let c = next.index_mut(&coord);
                    *c = n;
                }
            }
        }
        next
    }

    pub fn new(width: u32, height: u32) -> Universe {
        let cells = (0..width * height).map(|_| match js_sys::Math::random() > 0.5 {
            true => Cell::Alive,
            false => Cell::Dead,
        }).collect();

        Universe {
            width,
            height,
            cells,
        }
    }

    pub fn set_size(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
    }
}

#[wasm_bindgen]
pub struct DxUniverse {
    cur: Universe,
    next: Universe,
    dx: Vec<u8>,
    frames_per_tick: u8,
    cur_frames: u8,
}

// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace = console)]
//     fn log(s: &str);
// }

#[wasm_bindgen]
impl DxUniverse {
    pub fn new(width: u32, height: u32) -> DxUniverse {
        console_error_panic_hook::set_once();
        let cur = Universe::new(width, height);
        let next = cur.tick();
        let frames_per_tick = 60;
        let cur_frames = 0;
        let dx = (0..width * height)
            .map(|i| match (cur.index(i as usize), next.index(i as usize)) {
                (Cell::Alive, Cell::Alive) => frames_per_tick - 1,
                (_, Cell::Alive) => cur_frames % frames_per_tick,
                (Cell::Dead, Cell::Dead) => 0,
                (_, Cell::Dead) => frames_per_tick - 1 - (cur_frames % frames_per_tick),
            })
            .collect();

        DxUniverse {
            cur,
            next,
            dx,
            frames_per_tick,
            cur_frames,
        }
    }

    pub fn tick(&mut self) {
        if self.cur_frames == self.frames_per_tick {
            mem::swap(&mut self.next, &mut self.cur);
            self.next = self.cur.tick();
            self.cur_frames = 0
        }
        for i in 0..self.cur.length() {
            self.dx[i] = match (self.cur.index(i), self.next.index(i)) {
                (Cell::Alive, Cell::Alive) => self.frames_per_tick - 1,
                (_, Cell::Alive) => self.cur_frames % self.frames_per_tick,
                (Cell::Dead, Cell::Dead) => 0,
                (_, Cell::Dead) => {
                    (self.frames_per_tick - 1) - (self.cur_frames % self.frames_per_tick)
                }
            }
        }
        self.cur_frames += 1
    }

    pub fn cells(&self) -> *const u8 {
        self.dx.as_ptr()
    }

    pub fn set_cell(&mut self, row: u32, col: u32, state: Cell) {
        let coord = Coord {
            x: col as i32,
            y: row as i32,
        };
        let c = self.next.index_mut(&coord);
        *c = state;
    }

    pub fn set_size(&mut self, width: u32, height: u32) {
        self.cur.set_size(width, height);
        self.next.set_size(width, height);
    }
}

#[wasm_bindgen]
pub fn get_memory() -> JsValue {
    wasm_bindgen::memory()
}
