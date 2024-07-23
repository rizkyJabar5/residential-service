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
	  house: {
			field: {
				unit: [
					{
            required: true,
            message: 'Masukkan nomor unit terlebih dahulu!',
          },
          {
            max: 10,
            message: 'Nomor unit maksimal 10 karakter!',
          },
				],
				owner: [
					{
            required: true,
            message: 'Masukkan nama pemilik terlebih dahulu!',
          },
          {
            max: 50,
            message: 'Nama pemilik maksimal 50 karakter!',
          },
				],
				ownershipStatus: [
					{
            required: true,
            message: 'Pilih status kepemilikan terlebih dahulu!',
          },
				],
				homeCondition: [
					{
            required: true,
            message: 'Masukkan kondisi rumah',
          },
				],
				phoneNumber: [
					{
            required: true,
            message: 'Masukkan nomor telepon pemilik terlebih dahulu!',
          },
          {
            max: 15,
            message: 'Nomor telepon maksimal 15 karakter!',
          },
				]
			}
	  },
    report: {
        field: {
            nameReports: [
                {
                    required: true,
                    message: 'Masukkan nama laporan!',
                },
            ],
            location: [
                {
                    required: true,
                    message: 'Masukkan alamat lokasi kerusakan!'
                }
            ],
            typeFacility: [
                {
                    required: true,
                    message: 'Pilih type jenis fasilitas!'
                }
            ],
            imageUrl: [
                {
                    required: true,
                    message: 'Masukkan gambar fasilitas yang rusak!'
                }
            ]
        }
    },
    finance: {
        field: {
            imageUrl: [
                {
                    required: true,
                    message: 'Masukkan bukti foto!'
                }
            ]
        }
    },

		news: {
			title: [
				{
					required: true,
					message: 'Masukkan judul berita!',
				},
			],
			content: [
				{
					required: true,
					message: 'Masukkan isi berita!',
				},
			],
			event: [
				{
					required: true,
					message: 'Masukkan agenda acara!',
				},
			],
			location: [
				{
					required: true,
					message: 'Masukkan lokasi acara!',
				},
			],
			eventDate: [
				{
					required: true,
					message: 'Masukkan tanggal acara!',
				},
			],
			startTime: [
				{
					required: true,
					message: 'Masukkan waktu mulai acara!',
				},
			],
			endTime: [
				{
					required: true,
					message: 'Masukkan waktu akhir acara!',
				},
			],

		},

    auth: {
        confirm: [
            {
                required: true,
                message: 'Konfirmasi password Anda!',
            },
            ({getFieldValue}) => ({
                validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject('Password tidak cocok');
                },
            }),
        ],
        password: [
            {
                required: true,
                message: 'Masukkan password',
            },
        ],
        email: [
            {
                required: true,
                message: 'Masukka alamat email',
            },
            {
                type: 'email',
                message: 'Email tidak valid!',
            },
        ],
    },
}