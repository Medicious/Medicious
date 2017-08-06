import * as React from "react";
import  * as API from "./api.service";

interface Med {
	_id: string;
	id?: string;
	typeName?: string;
	typeId?: string;
	atcId?: string;
	atcCatName?: string;
	atcName?: string;
	substanceName?: string;
	productName?: string;
	form?: string;
	strength?: string;
	units?: string;
	packages?: any;
	areaOfUse?: string;	
	dosis?: string;
}

export default class ListItem extends React.Component<{}, {}> {
	props: {
		name: string;
		date: string;
		email: string;
		phone: string;
		meds: Med[];
		id?: string;
		_id: string;
	}

	state: {
		name: string
		date: string;
		email: string;
		phone: string;
		medSearch: string;
		meds: Med[];
	}

	constructor() {
		super();
		this.props;
		this.state = {
			name: "",
			date: "",
			email: "",
			phone: "",
			medSearch: "",
			meds: [],
		}
	}

	delete(patientId: string){
		API.deletePatient(patientId);
	}

	stopEdit() {
		let alreadyActive = document.getElementsByClassName("editActive");
		if (alreadyActive.length > 0) {
			for (var i = alreadyActive.length - 1; i >= 0; i--) {
				alreadyActive[i].classList.remove("editActive");
			}
		}
	}

	initiateEdit(event: any) {
		this.stopEdit();

		this.setState({
			name: this.props.name,
			date: this.props.date,
			email: this.props.email,
			phone: this.props.phone,
		});

		const target: HTMLElement = event.target as HTMLElement;
		target.classList.add("editActive");

		let activeElement: HTMLInputElement = target.nextElementSibling as HTMLInputElement;
		if (target.classList.contains("patientList-patient-meds")) {
			var top = activeElement.getBoundingClientRect().top + 30;
			let activeElementContainer = activeElement.getElementsByClassName("medSearcher")[0] as HTMLDivElement;
			activeElementContainer.style.marginTop = top + "px";

			activeElement = activeElementContainer.getElementsByClassName("medSearcher-search")[0] as HTMLInputElement;
		}

		activeElement.focus();		
	}

	edit(event: any) {
		const target: HTMLInputElement = event.target as HTMLInputElement;
		const field = target.getAttribute("name");
		this.setState({ [field]: target.value });
	}

	medFilter(filter: string) {
		return function(med: any) {
	        if (med.name.toLowerCase().match(filter.toLowerCase()))
				return med;
	    }
	}

	medSearch(event: any) {
		this.edit(event);
		if (!event.target.value)
			return;

		let self = this;
		let promise = API.getMeds(event.target.value).then(function(data){
			let meds: Med[] = [];
			for (let i = data.data.length - 1; i >= 0; i--) {
				meds.push(data.data[i]);
			}
			meds = meds.slice(0, 5);
			self.setState({meds: meds});
		});
	}

	addMed(med: Med) {
		let alreadyExists: boolean;
		for (var i = this.props.meds.length - 1; i >= 0; i--) {
			if (this.props.meds[i]._id == med._id) 
				return alreadyExists = true;
		}

		this.props.meds.push(med);
		this.confirmEdit();
	}

	confirmEdit() {
		API.editPatient({
			name: this.state.name,
			date: this.state.date,
			email: this.state.email,
			phone: this.state.phone,
			meds: this.props.meds as any,
			id: this.props.id,
			_id: this.props._id
		});
	}

	keyHandler(event: any) {
		if (event.keyCode == 27) {
			this.stopEdit();
		} else if (event.keyCode == 13) {
			this.confirmEdit();

			const self = this;
			let myVar = setInterval(function(){
				if (self.state.name === self.props.name &&
					self.state.date === self.props.date &&
					self.state.email === self.props.email &&
					self.state.phone === self.props.phone) {
					self.stopEdit();
					clearInterval(myVar);
				}
			}, 100);
		}
	}

	inital(string: string){
		return string.toUpperCase()[0];
	}

	render() {
		return (
			<li className="patientList-patient">
				<div className="patientList-patient-cell patientList-patient-name"
					onClick={(event: any) => this.initiateEdit(event)}>{this.props.name}</div>
				<input className="patientList-patient-cell-edit" type="text" name="name" value={this.state.name}
					onChange={(event: any) => this.edit(event)}
					onBlur={() => this.stopEdit()}
					onKeyUp={(event: any) => this.keyHandler(event)}/>

				<div className="patientList-patient-cell patientList-patient-date"
					onClick={(event: any) => this.initiateEdit(event)}>{this.props.date}</div>
				<input className="patientList-patient-cell-edit" type="text" name="date" value={this.state.date}
					onChange={(event: any) => this.edit(event)}
					onBlur={() => this.stopEdit()}
					onKeyUp={(event: any) => this.keyHandler(event)}/>

				<div className="patientList-patient-cell patientList-patient-email"
					onClick={(event: any) => this.initiateEdit(event)}>{this.props.email}</div>
				<input className="patientList-patient-cell-edit" type="text" name="email" value={this.state.email}
					onChange={(event: any) => this.edit(event)}
					onBlur={() => this.stopEdit()}
					onKeyUp={(event: any) => this.keyHandler(event)}/>

				<div className="patientList-patient-cell patientList-patient-phone"
					onClick={(event: any) => this.initiateEdit(event)}>{this.props.phone}</div>
				<input className="patientList-patient-cell-edit" type="text" name="phone" value={this.state.phone}
					onChange={(event: any) => this.edit(event)}
					onBlur={() => this.stopEdit()}
					onKeyUp={(event: any) => this.keyHandler(event)}/>

				<div className="patientList-patient-cell patientList-patient-meds"
					onClick={(event: any) => this.initiateEdit(event)}>
					{this.props.meds.map((med: Med) =>
			        <div className="patientList-patient-meds-med" key={med._id}> {this.inital(med.productName)} </div>
			    	)}
				</div>
				<div className="patientList-patient-cell-edit">
					<div className="medSearcher-background" onClick={() => this.stopEdit()}></div>
					<div className="medSearcher">
						<input className="medSearcher-search" type="text" name="medSearch" value={this.state.medSearch}
						onChange={(event: any) => this.medSearch(event)} placeholder="search..."/>
						{this.state.meds.map((med: Med) =>
					    <div className="medSearcher-med" key={med._id} onClick={(event: any) => this.addMed(med)}>
					    	{med.productName}
					    </div>
					    )}
					</div>
					{this.props.meds.map((med: Med) =>
			        <div className="patientList-patient-meds-med" key={med._id}> {this.inital(med.productName)} </div>
			    	)}
				</div>

				<div className="patientList-patient-cell patientList-patient-delete" 
					onClick={() => this.delete(this.props._id) }>Delete</div>
			</li>
		);
	}
}