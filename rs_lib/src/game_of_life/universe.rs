use rand::Rng;
use super::coord::{ OFFSETS, Coord };


#[derive(Debug, Clone, Copy)]
pub enum Cell {
  Dead = 0,
  Alive = 1,
}

pub struct Universe {
  width: u32,
  height: u32,
  cells: Vec<Cell>,
}


impl Universe {
  fn transform_coord(&self, coord: &Coord) -> Coord {
    let mut out = *coord;
    let w = self.width as i32;
    let h = self.height as i32;
    if out.x >= w {
      out.x = 0
    }
    if out.y >= h {
      out.y = 0
    }
    if out.x < 0 {
      out.x = w - 1
    }
    if out.y < 0 {
      out.x = h - 1
    }
    out
  }

  fn coord_to_index(&self, coord: &Coord) -> usize {
    let transformed = self.transform_coord(coord);
    (transformed.y * (self.width as i32) + transformed.x) as usize
  }

  fn alive_neighbours(&self, coord: &Coord) -> u8 {
    let mut count = 0;
    let indexes = OFFSETS.map(|off| self.coord_to_index(&(off + coord)));
    for i in indexes {
      if let Cell::Alive = self.cells[i] {
        count += 1;
      }
    }
    count
  }

  pub fn next_tick(&self) -> Universe {
    let mut clone = self.cells.clone();
    for height in 0..self.height as i32 {
      for width in 0..self.width as i32 {
        let coord = Coord {
          x: width,
          y: height,
        };
        let next_cell = match self.alive_neighbours(&coord) {
          x if x < 2 => Cell::Dead,
          3 => Cell::Alive,
          x if x >= 4 => Cell::Dead,
          _ => self.cells[self.coord_to_index(&coord)],
        };
        clone[self.coord_to_index(&coord)] = next_cell
      }
    }
    Universe {
      width: self.width,
      height: self.height,
      cells: clone,
    }
  }

  pub fn get_cell(&self, coord: &Coord) -> Cell {
    self.cells[self.coord_to_index(coord)]
  }

  pub fn set_cell(&mut self, coord: &Coord, state: Cell) -> () {
    let idx = self.coord_to_index(coord);
    self.cells[idx] = state;
  }

  pub fn new(width: u32, height: u32) -> Universe {
    let mut rng = rand::thread_rng();
    let mut cells = Vec::with_capacity((width * height) as usize);
    for _y in 0..height {
      for _x in 0..width {
        let r: bool = rng.gen();
        cells.push(match r {
          true => Cell::Alive,
          false => Cell::Dead,
        })
      }
    }
    Universe {
      width,
      height,
      cells,
    }
  }
}
