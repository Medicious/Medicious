import * as React from "react";
import List from "./list.component";
import  * as API from "./api.service";


export default class App extends React.Component<{}, {}> {
	state: any;
	constructor() {
		super();
		this.state = { filter: "" };
	}

	create(amount?: number){
		if (!amount) 
			return API.createPatient();
		for (let i = amount; i >= 0; i--) {
			API.createPatient();
		}
	}

	deleteAll(){
		API.deleteAllPatients();
	}

	searchFilter(filter: string) {
		return function(patient: any) {
	        if (patient.name.toLowerCase().match(filter.toLowerCase()))
				return patient;
	    }
	}

	searchByString(event: any) {
		this.setState({filter: event.target.value});
	}

	render() {
		return (
			<div>
				<div className="header"> 
					<h1>Medicious</h1>

					<div className="settingsBar">
					    <input onChange={(event: any) => this.searchByString(event)} placeholder="search by name..."/>

					    <div className="settingsButton" onClick={ () => this.create() }>
					    	Add Random Patient
					    </div >

						<div className="settingsButton" onClick={ () => this.create(5) }>
					    	Add 5 Random Patients
					    </div >

					    <div className="settingsButton" onClick={ () => this.deleteAll() }>
					    	Delete All Patients
					    </div >
				    </div>
			    </div>
				
				<List searchFilter={this.searchFilter} filter={this.state.filter} />
			</div>
		);
	}
}
