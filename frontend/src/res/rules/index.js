export const rules = {
	citizen: {
		field: {
			kkId: [
				{
					required: true,
					message: 'Masukkan Nomor KK terlebih dahulu!',
				},
				{
					max: 20,
					message: 'Nomor KK maksimal 20 karakter!',
				},
			],
			nik: [
				{
					required: true,
					message: 'Masukkan Nomor Induk Kependudukan terlebih dahulu!',
				},
				{
					max: 20,
					message: `Nomor Induk Kependudukan maksimal 20 karakter!`,
				},
			],
			fullName: [
				{
					required: true,
					message: 'Masukkan nama lengkap Anda!',
				},
			],
			gender: [
				{
					required: true,
					message: 'Masukkan Jenis Kelamin',
				},
			],
			placeOfBirth: [
				{
					required: true,
					message: 'Masukkan Tempat Lahir',
				},
			],
			dateOfBirth: [
				{
					type: 'date',
					required: true,
					message: 'Masukkan Tanggal Lahir',
				},
			],
			religion: [
				{
					required: true,
					message: 'Masukkan Agama Anda!',
				},
			],
			latestEducation: [
				{
					required: true,
					message: 'Masukkan Pendidikan terakhir Anda!',
				},
			],
			familyStatus: [
				{
					required: true,
				},
			],
			jobType: [
				{
					required: true,
					message: 'Masukkan pekerjaan Anda!',
				},
			],
			bloodType: [
				{
					required: true,
					message: 'Pilih Golongan Darah Anda!',
				},
			],
			marriageStatus: [
				{
					required: true,
					message: 'Pilih status perkawinan Anda!',
				},
			],
			address: [
				{
					required: true,
					message: 'Masukkan alamat Anda!',
				},
			],
			onlyRequired: [
				{
					required: true,
				},
			],
			letterType: [
				{
					required: true,
					message: 'Pilih salah satu jenis pengajuan',
				},
			],
			nationality: [
				{
					required: true,
					message: 'Masukkan kewarganegaraan Anda!',
				},
			],
		}, // field
	},
}