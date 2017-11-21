import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square">
//         {/* TODO */}
//       </button>
//     );
//   }
// }

// class Board extends React.Component {
//   renderSquare(i) {
//     return <Square />;
//   }

//   render() {
//     const status = 'Next player: X';

//     return (
//       <div>
//         <div className="status">{status}</div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

// class Game extends React.Component {
//   render() {
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board />
//         </div>
//         <div className="game-info">
//           <div>{/* status */}</div>
//           <ol>{/* TODO */}</ol>
//         </div>
//       </div>
//     );
//   }
// }

// PayrollContract

class PayrollContract extends React.Component {
	render() {
		return (
      // <div className="payrollContract">
      //   <div className="game-board">
      //     <Board />
      //   </div>
      //   <div className="game-info">
      //     <div>{/* status */}</div>
      //     <ol>{/* TODO */}</ol>
      //   </div>
      // </div>
      <div className="payrollContract">
	      <h3>Account balance: <br></br>
		      <span class="black">
		        <span id="accountBalance"></span>
		      </span>
		    </h3>

		    <div className="meatMaskAccount">
		    	<MetamaskAccount />
		    </div>

		    <button id="createContract" onclick="App.newPayrolContract()">New Contract</button>
	     		or 
		    <button id="importContract" onclick="App.importContract()">Import</button>
		    <br></br>
		    <br></br>
		    <input type="text" id="importContractAddress" placeholder="e.g., 0x93e66d9baea28c17d9fc393b53e3fbdd76899dae"></input>
		    <br></br>
		    <br></br>
		    <span id="contractConnectionStatus"></span>
		    
		    <h3>
		      <span class="black">Create New Employee:</span>
		    </h3>
		    <label for="employeeAddress">Address:</label>
		    <input type="text" id="employeeAddress" placeholder="e.g., 0x93e66d9baea28c17d9fc393b53e3fbdd76899dae"></input>
		    <br></br>
		    <label for="employeeRate">Hourly Rate:</label>
		    <input type="text" id="employeeRate" placeholder="e.g., 21.36"></input>
		    <br></br>
		    <br></br>
		    <button id="addEmployee" onclick="App.insertEmployee()">Insert Employee</button>
		    <br></br>
		    <br></br>
		    
		    <h3>
		      <span class="black">Log Hours:</span>
		    </h3>
		    <label for="hours">Hours:</label>
		    <input type="text" id="hours" placeholder="e.g., 1.2"></input>
		    <br></br>
		    <br></br>
		    <button id="logHours" onclick="App.logHours()">Submit Hours</button>

		    <h3>
		      <span class="black">Deposit Eth</span>
		    </h3>
		    <label for="ethDeposit">Amount:</label>
		    <input type="text" id="ethDeposit" placeholder="e.g., 95"></input>
		    <br></br>
		    <br></br>
		    <button id="deposit" onclick="App.depositEth()">Deposit</button>
		    <br></br>
		    <span id="status"></span>

		    <h3>
		      <span class="black">Employee Information</span>
		    </h3>
		    <label for="employeeRate">Address:</label>
		    <input type="text" id="address" placeholder="e.g., 0x93e66d9baea28c17d9fc393b53e3fbdd76899dae"></input>
		    <br></br>
		    <br></br>
		    <button id="getEmployeeRate" onclick="App.getEmployeeRate()">Get Rate</button>
		    <button id="getEmployeeHours" onclick="App.getEmployeeHours()">Get Hours</button>
		    <button id="payEmployee" onclick="App.payEmployee()">Pay Employee</button>
		    <br></br>
		    <span id="employeeView"></span>
		    <br></br>
		    <br></br>
		    <button id="employeeList" onclick="App.getEmployeeList()">List Employees</button>


		    <br></br>
		    <br></br>
		    <br></br>
		  </div>
		)
	}
}

class MetamaskAccount extends React.Component {
	render() {
		return (
			<h3>Meta Mask Account: 
	      <span class="black">
	        <span id="devAccounts"></span>
	      </span>
	    </h3>
		)
	}
}


// ========================================

ReactDOM.render(
  <PayrollContract />,
  document.getElementById('root')
);
