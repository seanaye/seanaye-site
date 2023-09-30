use std::ops::Add;


#[derive(Clone, Copy)]
pub struct Coord {
  x: i32,
  y: i32,
}

impl Add<&Coord> for Coord {
  type Output = Self;

  fn add(self, other: &Coord) -> Self {
    Self {
      x: self.x + other.x,
      y: self.y + other.y,
    }
  }
}

pub const OFFSETS: [Coord; 8] = [
  Coord { x: 0, y: 1 },
  Coord { x: 1, y: 0 },
  Coord { x: -1, y: 0 },
  Coord { x: 0, y: -1 },
  Coord { x: -1, y: -1 },
  Coord { x: 1, y: 1 },
  Coord { x: -1, y: 1 },
  Coord { x: 1, y: -1 },
];
