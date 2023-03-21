class ExpertAdvice {
  constructor() {
    this.expert_advices = [
        {//0
            fault_type : 'Partial /Corona discharges (PD)',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Discharges in gas-filled cavities in insulation, resulting from incomplete impregnation, high moisture in paper, gas-in-oil super-saturation or cavitation (gas bubbles in oil), leading to X wax formation on paper.'],
            diagnostics : [
                '1. Confirm with electrical & acoustic PD technique - online',
                '2. Performed moisture assessment (oil test)/dirana/Power factor test)',
                '3. Perform oil degassing/vacuuming – offline',
            ]
        },
        {//1
            fault_type : 'Partial /Corona discharges (PD) + Stray Gassing on Duval T4',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Discharges in gas-filled cavities in insulation, resulting from incomplete impregnation, high moisture in paper, gas-in-oil super-saturation or cavitation (gas bubbles in oil), leading to X wax formation on paper.'],
            diagnostics : [
                '-Perform stray gassing test at lab and change inhibited oil if necessary',
                '-Online/Offline',
            ]
        },
        {//2
            fault_type : 'Partial /Corona discharges (PD) + Stray Gassing on Duval T4',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Discharges in gas-filled cavities in insulation, resulting from incomplete impregnation, high moisture in paper, gas-in-oil super-saturation or cavitation (gas bubbles in oil), leading to X wax formation on paper.'],
            diagnostics : ['-Material Compatibility test at lab - Online']
        },
        {//3
            fault_type : 'Discharges of low energy (D1)',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Sparking or arcing between bad connections of different floating potential, from shielding rings, toroids, adjacent discs or conductors of different windings, broken brazing, closed loops in the core. Additional core grounds. Discharges between clamping parts, bushing and tank, high voltage and ground, within windings. Tracking in wood blocks, glue of insulating beam, winding spacers. Dielectric breakdown of oil, load tap changer breaking contact.'],
            diagnostics : ['Use electrical/acoustic detection techniques (online)']

        },
        {//4
            fault_type : 'Discharges of high energy (D2)',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Flashover, tracking or arcing of high local energy, or with power follow through. Short circuits between low voltage and ground, connectors, windings, bushings, and tank, windings and core copper bus and tank, in oil duct. Closed loops between two adjacent conductors around the main magnetic flux, insulated bolts of core,metal rings holding core legs. '],
            diagnostics : [
                '1. Perform electrical/acoustic detection techniques (online)',
                '2. Electrical test (offline) i.e. .Ratio, Excitation current test, Frequency Response Stray Losses (FRSL) ,Winding Resistance, Insulation Resistance Core/Winding',
                '3. Internal inspection if necessary',
            ]

        },
        {//5
            fault_type : 'Overheating less than 300°C (T1)',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Overloading the transformer in emergency situations. Blocked or restricted oil flow in windings. Other cooling problems, pumps valves, etc. Stray flux in damping beams of yoke.'],
            diagnostics : [
                '1. Check cooling system – Visual checks /setting verification',
                '2. Electrical test (offline) i.e. .Ratio, Excitation current test, Frequency Response Stray Losses (FRSL) ,Winding Resistance, Insulation Resistance Core/Winding'
            ]

        },
        {//6
            fault_type : 'Overheating 300 to 700°C (T2) ',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Defective contacts at bolted connections (especially bus bar), contacts within tap changer, connections between cable and draw rod of bushings. Circulating currents between yoke clamps and bolts, clamps and laminations, in ground wiring, bad welds or clamps in magnetic shields. Abraded insulation between adjacent parallel conductors in windings.'],
            diagnostics : [
                '1. Electrical test - Winding resistance measurement, Core-Frame Insulation Resistance. Dynamic Resistance OLTC – Offline ',
                '2. OLTC Operational test  - Offline Internal inspection if necessary',
            ]
        },
        {//7
            fault_type : 'Overheating over 700°C (T3) ',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['Large circulating currents in tank and core. Minor currents in tank walls created by high uncompensated magnetic field. Shorted core laminations.'],
            diagnostics : [
                '1. Electrical test - Core – Frame Insulation test , Excitation current test, ',
                '2. Perform thermal scanning to checks on tank walls (Online)',
                '3. Internal inspection if necessary'
            ]

        }
    ];

    this.complimentaryRatioList = [
         {//0
            fault_type : 'Cellulose Decomposition',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : [
                'Fault:',
                'If CO >1000, CO2/CO less than 3   high temperature localized overheating of paper<br/>',
                'Normal state:',
                'If CO2/CO 5 to 9 normal state<br/>',
                'Normal aging state:',
                'If CO2>10000, CO2/CO >10, mild thermal fault on cellulose or oil oxidation'
            ],
            diagnostics : [
                    'If rule 1 is true:',
                    'Perform furanic compound analysis or oil quality assessment if not normal',
                    'Degree of Polymerisation test on leads and other accessible areas if nessary'
                ]
        },
        {//1
            fault_type : 'oil contamination from diverter switch of LTC',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['If C2H2/H2 is more than 2 and C2H2>35ppm'],
            diagnostics : ['To check dga at conservator level and minus for analysis or deemed not reliable. Check/rectify source of contamination if conservator not sharing']

        },
        {//2
            fault_type : 'consumption of oxygen, bad sealing',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : ['abnormal oil heating or oil oxidation (free breathing tx) O2/N2 <0.3'],
            diagnostics : ['Check oil quality test results i.e acidity, IFT and Power factor / Check oil leakages/ Air bag leakages']

        },
        {//3
            fault_type : 'Heating in Bare Metal/Celullose',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : [
                'heating of bare metal',
                'C2HC2H6 if =>4 ,<br/>',
                'possible heating of paper wrapped conductor',
                'C2H4/C2H6 if < 4',
                'Either one of the gas exceeds Condition 1'],
            diagnostics : ['Perform inspection and testing if rate of rise exceeds allowable limits, perform electrical testing (Refer Fault Type T2/T3). To compliment with other analysis']

        },
        {//4
            fault_type : 'High Energy Thermal Overheating/Arcing',
            rate_rise : 'Calculation ppm/day',
            sampling : 'Weekly',
            possible_faults : 
                [
                    'Oil overheating above 700deg C If C2H2/C2H4 <0.1,',
                    'Oil overheating above 700 deg C with some arcing possible If C2H2/C2H4 =>0.1-0.2,',
                    'Arcing <br/>If C2H2/C2H4>0.2',
                    'Either one of the gas exceeds Condition 1'
                ],
            diagnostics : ['Immediate inspection/Removal of unit from service if arcing possibilities detected. To compliment with other analysis']
        },
    ];
  }
  getExpertAdviceList() {
    return this.expert_advices;
  }
}
