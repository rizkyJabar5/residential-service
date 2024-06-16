export const familyStatus = [
	{ value: "HEAD_OF_FAMILY", label: "Kepala Keluarga" },
	{ value: "HUSBAND", label: "Suami" },
	{ value: "WIFE", label: "Istri" },
	{ value: "CHILDREN", label: "Anak" },
	{ value: "SON_IN_LAW", label: "Menantu" },
	{ value: "GRANDCHILDREN", label: "Cucu" },
	{ value: "PARENTS", label: "Orang Tua" },
	{ value: "IN_LAWS", label: "Mertua" },
	{ value: "OTHER_FAMILIES", label: "Keluarga lain" },
	{ value: "MAID", label: "Pembantu" },
	{ value: "OTHERS", label: "Lainnya" },
];

export const religions = [
	{ value: "ISLAM", label: "Islam" },
	{ value: "KATOLIK", label: "Katolik" },
	{ value: "PROTESTAN", label: "Protestan" },
	{ value: "HINDU", label: "Hindu" },
	{ value: "BUDHA", label: "Budha" },
];

export const bloodType = [
	{ value: "A", label: "A" },
	{ value: "B", label: "B" },
	{ value: "AB", label: "AB" },
	{ value: "O", label: "O" },
	{ value: "NONE", label: "-" },
];

export const gender = [
	{ value: "MALE", label: "Laki-laki" },
	{ value: "FEMALE", label: "Wanita" },
];

export const marriageStatus = [
	{ value: "MARRIAGE", label: "Kawin" },
	{ value: "UNMARRIED", label: "Belum Kawin" },
];

export const latestEducation = [
	{ value: "OUT_OF_SCHOOL", label: "Tidak Sekolah" },
	{ value: "SD", label: "SD" },
	{ value: "SMP", label: "SMP" },
	{ value: "SMA", label: "SMA" },
	{ value: "SMK", label: "SMK" },
	{ value: "D1", label: "D1" },
	{ value: "D2", label: "D2" },
	{ value: "D3", label: "D3" },
	{ value: "S1", label: "S1" },
	{ value: "S2", label: "S2" },
	{ value: "S3", label: "S3" },
];


export function valueOfReligion(label) {
	const foundReligion = religions.find(item => item.label === label);
	return foundReligion?.value;
}

export function valueOfFamilyStatus(label) {
	const foundFamilyStatus = familyStatus.find(item => item.label === label);
	return foundFamilyStatus?.value;
}

export function valueOfBloodType(label) {
	const foundBloodType = bloodType.find(item => item.label === label);
	return foundBloodType?.value;
}

export function valueOfGender(label) {
	const foundGender = gender.find(item => item.label === label);
	return foundGender?.value;
}

export function valueOfMarriageStatus(label) {
	const foundMarriageStatus = marriageStatus.find(item => item.label === label);
	return foundMarriageStatus?.value;
}

export function valueOfLatestEducation(label) {
  const foundLatestEducation = latestEducation.find(item => item.label === label);
  return foundLatestEducation?.value;
}
