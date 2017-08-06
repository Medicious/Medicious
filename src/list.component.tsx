import * as React from "react";
import ListItem from "./list-item.component";
import * as API from "./api.service";

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

interface Patient {
	name: string;
	date: string;
	email: string;
	phone: string;
	meds?: Med[];
	id?: string;
	_id?: string;
}

export default class List extends React.Component<{ searchFilter: any, filter: any }, {}> {
	interval: number;
	state: any;

	constructor() {
		super();
		this.props;
		this.state = { 
			patients: []
		};
	}

		componentWillMount() {
			this.interval = window.setInterval(() => {
				let self = this;
				let promise = API.getPatients().then(function(data){
					let patients: Patient[] = [];
					for (let i = data.data.length - 1; i >= 0; i--) {
						patients.push(data.data[i]);
					}
					let filtered = patients.filter(self.props.searchFilter(self.props.filter));
					
					filtered.sort(function (a, b) {
						const a_name = a.name.toUpperCase();
						const b_name = b.name.toUpperCase();
						if (a_name < b_name)
							return -1;
						if (a_name > b_name)
							return 1;
						return 0;
					});

					self.setState({patients: filtered});
				});
			}, 500);
		}

		componentWillUnmount() {
				window.clearInterval(this.interval);
		}

		toggleAddPatient() {
			let form = document.getElementsByClassName("patientList-newPatient")[0];
			form.classList.toggle("addActive");
			if (form.classList.contains("addActive")) 
				form.getElementsByTagName("input")[0].focus();
		}

		createNewPatient(event: any) {
			event.preventDefault();
			if (!event.target.name.value) 
				return;
			if (!event.target.date.value) 
				return;
			if (!event.target.email.value) 
				return;
			if (!event.target.phone.value) 
				return;

			const patient: Patient = {
			name: event.target.name.value,
			date: event.target.date.value,
			email: event.target.email.value,
			phone: event.target.phone.value,
		};
		API.createPatient(patient);

		event.target.reset();
		this.toggleAddPatient();
		}

	render() {
		return (
			<ul className="patientList">
				<li className="patientList-title">
					<div>Name</div>
					<div>Date</div>
					<div>Email</div>
					<div>Phone</div>
					<div>Meds</div>
					<div onClick={ () => this.toggleAddPatient() }>Add</div>
				</li>

				<form className="patientList-patient patientList-newPatient"
					onSubmit={ (event: any) => this.createNewPatient(event)}>
					<input type="text" name="name" className="patientList-patient-cell patientList-patient-name" placeholder="firstname lastname"/>
					<input type="text" name="date" className="patientList-patient-cell patientList-patient-date" placeholder="0000-00-00"/>
					<input type="text" name="email" className="patientList-patient-cell patientList-patient-email" placeholder="name@domain"/>
					<input type="text" name="phone" className="patientList-patient-cell patientList-patient-phone" placeholder="555-000-0000"/>
					<input type="submit" name="submit" value="Confirm" 
						className="patientList-patient-cell patientList-patient-confirm"/>
					<div className="patientList-patient-cell patientList-patient-cancel" 
						onClick={ () => this.toggleAddPatient() }>Cancel</div>
				</form>

				<ListItem
					name=""
					date=""
					email="" 
					phone=""
					meds={[]}
					_id="" />

				{this.state.patients.map((patient: Patient) =>
					<ListItem 
						key= {patient._id}
						name= {patient.name}
						date= {patient.date}
						email= {patient.email} 
						phone= {patient.phone}
						meds= {patient.meds} 
						_id= {patient._id} />
					)}
			</ul>
		);
	}
}