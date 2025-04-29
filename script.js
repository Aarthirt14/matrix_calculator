// Ensure DOM is ready before running
window.addEventListener('DOMContentLoaded', generateMatrices);
document.getElementById('rows').addEventListener('change', generateMatrices);
document.getElementById('cols').addEventListener('change', generateMatrices);

function generateMatrices() {
    const rows = +document.getElementById('rows').value;
    const cols = +document.getElementById('cols').value;
    const matrixA = document.getElementById('matrixAInputs');
    const matrixB = document.getElementById('matrixBInputs');
    const rhsB   = document.getElementById('rhsBInputs');

    matrixA.innerHTML = '';
    matrixB.innerHTML = '';
    rhsB.innerHTML = '';

    // Generate A & B
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= cols; j++) {
        ['A','B'].forEach(m => {
          const div = document.createElement('div');
          div.className = 'matrix-container';
          div.innerHTML = `
            <span class="matrix-label">${m.toLowerCase()}${i}${j}</span>
            <input type="number" class="matrix-cell" id="${m}${i}${j}" />
          `;
          (m === 'A' ? matrixA : matrixB).append(div);
        });
      }
      // RHS column vector
      const div = document.createElement('div');
      div.className = 'matrix-container';
      div.innerHTML = `
        <span class="matrix-label">rhs${i}</span>
        <input type="number" class="matrix-cell" id="RHS${i}" />
      `;
      rhsB.append(div);
    }

    matrixA.style.gridTemplateColumns = `repeat(${cols}, auto)`;
    matrixB.style.gridTemplateColumns = `repeat(${cols}, auto)`;
    rhsB.style.gridTemplateColumns   = `auto`;
}

function getMatrix(which) {
    const r = +document.getElementById('rows').value;
    const c = +document.getElementById('cols').value;
    const M = [];
    for (let i=1; i<=r; i++){
      const row = [];
      for (let j=1; j<=c; j++){
        row.push(+document.getElementById(`${which}${i}${j}`).value || 0);
      }
      M.push(row);
    }
    return M;
}

function getRHSMatrix(){
    const r = +document.getElementById('rows').value;
    const v = [];
    for (let i=1; i<=r; i++){
      v.push(+document.getElementById(`RHS${i}`).value || 0);
    }
    return v;
}

function displayResult(res){
    const out = document.getElementById('result');
    if (Array.isArray(res)){
      if (Array.isArray(res[0])){
        out.innerText = res.map(row=>row.join(' ')).join('\n');
      } else {
        out.innerText = res.join(' ');
      }
    } else {
      out.innerText = res;
    }
}

function clearInputs(){
    document.querySelectorAll('input[type="number"]').forEach(i=>i.value='');
    document.getElementById('result').innerText = '';
}

function downloadResult(){
    const blob = new Blob([document.getElementById('result').innerText], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'matrix_result.txt';
    a.click();
}

function addMatrices(){
  try{ displayResult(math.add(getMatrix('A'), getMatrix('B'))); }
  catch(e){ alert(e.message); }
}

function subtractMatrices(){
  try{ displayResult(math.subtract(getMatrix('A'), getMatrix('B'))); }
  catch(e){ alert(e.message); }
}

function multiplyMatrices(){
  try{ displayResult(math.multiply(getMatrix('A'), getMatrix('B'))); }
  catch(e){ alert(e.message); }
}

function detMatrix(which){
  const M = getMatrix(which);
  if (M.length !== M[0].length) return alert('Must be square');
  displayResult(math.det(M).toFixed(4));
}

function transposeMatrix(which){
  displayResult(math.transpose(getMatrix(which)));
}

function calculateAdjoint(which){
  const M = getMatrix(which);
  if (M.length !== M[0].length) return alert('Must be square');
  const co = math.map(M, (v,[i,j])=>{
    const minor = M.filter((_,x)=>x!==i).map(r=>r.filter((_,y)=>y!==j));
    return Math.pow(-1,i+j)*math.det(minor);
  });
  displayResult(math.transpose(co));
}

function calculateMatrixPower(which){
  const M = getMatrix(which);
  if (M.length !== M[0].length) return alert('Must be square');
  const p = +prompt('Enter power:');
  if (isNaN(p)) return alert('Invalid power');
  displayResult(math.pow(M,p));
}
function inverseMatrix(which) {
  try {
    const M = getMatrix(which);
    if (M.length !== M[0].length) throw new Error('Matrix must be square.');
    displayResult(math.inv(M));
  } catch (err) {
    alert(err.message);
  }
}
function solveSystem(){
  const A = getMatrix('A');
  const b = getRHSMatrix().map(v=>[v]);
  if (A.length !== A[0].length)       return alert('A must be square');
  if (b.length !== A.length)          return alert('RHS size mismatch');
  displayResult(math.lusolve(A,b));
}

function fillRandomValues(){
  document.querySelectorAll('.matrix-cell')
          .forEach(i=> i.value = Math.floor(Math.random()*21)-10);
}
