let grid;
let score = 0;

function blankGrid() {
  let grid = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ]

  return grid
}

function checkGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 0) {
        return false
      }
      if ( i != 3 && grid[i][j] == grid[i + 1][j]) {
        return false
      }
      if ( j != 3 && grid[i][j] == grid[i][j+1]) {
        return false
      }
    }
  }
  return true
}



function setup() {
  createCanvas(400, 400);
  noLoop()
  grid = blankGrid()
  addNumber()
  addNumber()
  updateCanvas()
}

function copyGrid(grid) {
  let extra = blankGrid()

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j]
    }
  }

  return extra
}

function compare(a,b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] != b[i][j]) {
        return true
      }
    }
  }
  return false
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse()
  }

  return grid
}

function rotateGrid(grid) {
  let newGrid = blankGrid()

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i]
    }
  }

  return newGrid
}



function keyPressed() {

  let flipped = false
  let rotated = false
  let played = true



  if (keyCode === DOWN_ARROW) {
  // DO NOTHING
  } else if (keyCode === UP_ARROW) {
    grid = flipGrid(grid)
    flipped = true
  } else if (keyCode === RIGHT_ARROW) {
    grid = rotateGrid(grid)
    rotated = true
  } else if (keyCode === LEFT_ARROW) {
    grid = rotateGrid(grid)
    grid = flipGrid(grid)
    flipped = true
    rotated = true
  } else {
    played = false
  }


  if (played) {

    let past = copyGrid(grid)
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i])
      
    }
    let change = compare(past, grid)

    if (flipped) {
      grid = flipGrid(grid)
    }

    if (rotated) {
      grid = rotateGrid(grid)
    }

    if (change) {
      addNumber()
    }
    updateCanvas()

    let gameOver = checkGameOver()
    if (gameOver) {
      console.log("GAME OVER")
    }
  }


}


function operate(row) {
  row = slide(row)
  row = combine(row)
  row = slide(row)

  return row
}




function updateCanvas() {
  background(255);
  drawGrid()
  select('#score').html(score)
}



function addNumber() {
  let options = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j
        })
      }
    }
  }
  
  if (options.length > 0);
  {
    let spot = random(options)
    let r = random(1)
    grid[spot.x][spot.y] = r > 0.2 ? 2 : 4
  }

}


function drawGrid() {
  let w = 100
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      noFill()
      strokeWeight(4)
      let val = grid[i][j]
      let s = val.toString()
      stroke(0)
      if (val != 0) {
        fill(colorsSizes[s].color)
      } else {
        noFill()
      }

      rect(i * w, j * w, w, w, 6)

      

      if (val !== 0) {
        textAlign(CENTER, CENTER)
        fill(255)
        noStroke()
        textSize(colorsSizes[s].size)
        text(val, i * w + w / 2, j * w + w / 2)
      }
    }
  }
}


function slide(row) {
  let arr = row.filter(val => val)
  let missing = 4 - arr.length
  let zeros = Array(missing).fill(0)
  arr = zeros.concat(arr)

  return arr
}

function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i]
    let b = row[i - 1]
    if (a == b) {
      row[i] = a + b
      score += row[i]
      row[i- 1] = 0
    }
  }

  return row
}
