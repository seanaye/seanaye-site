use std::mem;

use super::coord::Coord;
use super::universe::{Universe, Cell};

pub struct DxUniverse {
  cur: Universe,
  next: Universe,
  dx: Vec<u8>,
  cur_step: u8,
  steps: u8,
}

impl DxUniverse {
  pub fn new(width: u32, height: u32, steps: u8) -> DxUniverse {
    let cur = Universe::new(width, height);
    let next = cur.next_tick();
    let cur_step = 0;

    let mut dx = Vec::with_capacity((width * height) as usize);
    for _ in 0..width * height {
      dx.push(0);
    }

    DxUniverse {
      cur,
      next,
      dx,
      cur_step,
      steps,
    }
  }

  fn calculate_dx(&mut self) {
    for y in 0..(self.cur.height as i32) {
      for x in 0..(self.cur.width as i32) {
        let coord = Coord { x, y };
        let cur_cell = self.cur.get_cell(&coord);
        let next_cell = self.next.get_cell(&coord);

        let color_index = match (cur_cell, next_cell) {
          (Cell::Alive, Cell::Alive) => self.steps - 1,
          (Cell::Dead, Cell::Dead) => 0,
          (_, Cell::Alive) => self.steps - 1 - self.cur_step % self.steps,
          (_, Cell::Dead) => self.cur_step % self.steps,
        };

        let idx = self.cur.coord_to_index(&coord);
        self.dx[idx] = color_index;
      }
    }
    self.cur_step += 1;
  }

  pub fn next_tick(&mut self) -> &Vec<u8> {
    if self.cur_step > 0 && self.cur_step % self.steps == 0 {
      mem::swap(&mut self.cur, &mut self.next);
      self.next = self.cur.next_tick();
    }
    self.calculate_dx();
    &self.dx
  }
}
