import Axios from "axios";
import * as Faker from "faker";

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

export async function getMeds(searchString: string): Promise<any> {
    return await Axios.get('https://fest-searcher.herokuapp.com/api/fest/s/' + searchString);
}

export async function getPatients(): Promise<any> {
    return await Axios.get('https://api-medicious.herokuapp.com/patients');
}

export async function deletePatient(patientId: string): Promise<void> {
    Axios.delete('https://api-medicious.herokuapp.com/patients/' + patientId);
}

export async function editPatient(patient: Patient): Promise<any> {
    return await Axios.put('https://api-medicious.herokuapp.com/patients/' + patient._id, patient);
}

export async function deleteAllPatients(): Promise<any> {
	const self = this;
	this.getPatients().then(function(data:any){
		for (let i = data.data.length - 1; i >= 0; i--) {
			self.deletePatient(data.data[i]._id);
		}
	});
}

export async function createPatient(patient?: Patient): Promise<any> {
	if (patient) {
		return await Axios.post('https://api-medicious.herokuapp.com/patients', {
			name: patient.name,
			date: patient.date,
			email: patient.email,
			phone: patient.phone
		});
	}

	const firstName = Faker.name.firstName();
	const lastName = Faker.name.lastName();

	const name = firstName + " " + lastName;
	const date = Faker.date.between('1930-01-01', '2000-01-01').toISOString().split("T")[0];
	const email = lastName + "." + firstName + "@" + Faker.internet.domainName();
	const phone = Faker.phone.phoneNumberFormat(0);

    return await Axios.post('https://api-medicious.herokuapp.com/patients', {
		name: name,
		date: date,
		email: email,
		phone: phone
	});
}