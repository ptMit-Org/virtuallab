// js/content.js

// --- HEADER & FOOTER DATA ---
export const SITE_DATA = {
    brandName: 'Virtual Laboratory',
    brandSub: 'By MIT',
    footerText: 'Developed and coordinated by: Dr. S.Vijayakumar, Dr.S.Sathish',
    footerSubText: ' Department of Production Technology, MIT Campus, Anna University, Chennai.'
};

// --- HOME PAGE CONTENT ---
export const HOME_CONTENT = {
    heroTitle: '',
    heroDescription: "",
    experimentsTitle: 'Available Experiments'
};

// --- ABOUT PAGE CONTENT ---
// This is an array of sections. 
// If 'isList' is true, 'text' should be an array of strings.
export const ABOUT_CONTENT = [
    {
        title: 'An Initiative',
        text: 'This virtual laboratory experimentation initiative of the Department of Production Technology (DoPT), MIT Campus, Anna University, Chennai, delivers engineering principles through digital innovation to create impactful learning tools that reflect the high academic standards of Anna University.',
        isList: false
    },
    {
        title: 'Vision',
        text: 'To provide an interactive and accessible virtual learning environment that enhances understanding of engineering principles, analytical thinking, and practical competence among engineering students through digital experimentation.',
        isList: false
    },
    {
        title: 'Objective',
        text: [
            'To complement conventional laboratory practices by providing a virtual platform for engineering experiments.',
            'To enhance understanding of the principles, construction, and operation of instruments through simulation-based learning.',
            'To promote self-paced, experiential, and self-directed learning beyond physical and time constraints.',
            'To improve experimental accuracy, data analysis, safety awareness, and preparedness for real laboratory sessions using modern engineering tools and industry practices.'
        ],
        isList: true
    },
    {
        title: 'Outcome',
        text: [
            'Apply fundamental engineering principles through effective use of virtual laboratory experiments.',
            'Understand and explain the working, construction, and application of engineering instruments.',
            'Perform experiments independently, analyze data accurately, and identify experimental errors.',
            'Demonstrate improved safety awareness and readiness for hands-on laboratory sessions using modern engineering tools and practices.'
        ],
        isList: true,
        intro: 'Upon successful use of the virtual lab, students will be able to:' // Optional intro text before list
    }
];

// --- SUBJECT CATEGORIES (Home Page Cards) ---
export const HOME_CATEGORY_CARDS = [
    {
        id: 'Metrology', // Should match 'subject' in EXPERIMENTS
        displayTitle: 'Metrology',
        description: 'Precision measurement and calibration experiments.',
        image: 'images/metrology.png'
    },
    {
        id: 'EDrawing',
        displayTitle: 'Engineering Graphics',
        description: 'Experiments related to technical drawing and design.',
        image: 'images/edrawing.jpg'
    },
    // {
    //     id: 'Fluid',
    //     displayTitle: 'Fluid Mechanics',
    //     description: 'Experiments related to the mechanics of fluids.',
    //     image: 'images/fluid.jpg'
    // }
];

// --- EXPERIMENTS DATA ---
const EXPERIMENTS = [
    {
        id: 'exp-1',
        subject: 'Metrology',
        title: 'Profile Projector',
        description: 'Study of Profile Projector and Measurement of Object Dimensions.',
        imagePath: 'images/experiment/profileprojector.jpg',
        // link: "https://mmmvirtuallab-cloud.github.io/profile-projector/"
        link: "profile-projector/"

    },
    {
        id: 'exp-2',
        subject: 'Metrology',
        title: "Micrometer",
        description: 'An outside micrometer is a precision measuring instrument used to measure external dimensions with high accuracy.',
        imagePath: 'images/experiment/micrometer.jpg',
        link: "micro-meter/"
    },
    {
        id: 'exp-3',
        subject: 'Metrology',
        title: "Surface Roughness (Profilometer)",
        description: 'A profilometer is a precision measuring instrument used to measure the surface profile of a material.',
        imagePath: 'images/experiment/surfaceroughness.jpg',
        link: "profilo-meter/"
    },
    {
        id: 'exp-4',
        subject: 'Metrology',
        title: "Three Wire Method",
        description: 'Technique used to accurately measure the effective diameter of a screw thread.',
        imagePath: 'images/experiment/threewire.jpg',
        link: "three-wire/"
    },
    {
        id: 'exp-5',
        subject: 'Metrology',
        title: 'Optical Autocollimator',
        description: 'Measure minute angular deviations and verify surface straightness using precision optical principles.',
        imagePath: 'images/experiment/autocollimator.jpg',
        link: 'auto-collimator/'
    },
    {
        id: 'exp-6',
        subject: 'Metrology',
        title: 'Bevel Protractor',
        description: 'Measure and layout angles with high precision using a versatile bevel protractor.',
        imagePath: 'images/experiment/bevelprotractor.jpg',
        link: 'bevel-protractor/'
    },
    {
        id: 'exp-7',
        subject: 'Metrology',
        title: 'Internal Taper Angle Measurement',
        description: 'Measure internal taper angles accurately using precision sphere.',
        imagePath: 'images/experiment/internaltaper.png',
        link: 'taper-angle/'
    },
    {
        id: 'exp-8',
        subject: 'Metrology',
        title: 'Vernier Caliper Experiment',
        description: 'Measure internal and external dimensions with high precision using a vernier caliper.',
        imagePath: 'images/experiment/verniercaliper.jpg',
        link: 'vernier-caliper/'
    },
    {
        id: 'exp-9',
        subject: 'Metrology',
        title: 'Roundness Measurement',
        description: 'Mesure roundness deviations of cylindrical objects using v-block and dial gauge.',
        imagePath: 'images/experiment/roundness.jpg',
        link: 'roundness-exp/'
    },
    {
        id: 'exp-10',
        subject: 'Metrology',
        title: 'External Taper Angle Measurement',
        description: 'Measure external taper angles accurately using vernier caliper ',
        imagePath: 'images/experiment/externaltaper.jpg',
        link: 'external-taper/'
    },
    {
        id: 'exp-11',
        subject: 'Metrology',
        title: 'Electrical Comparator',
        description: 'This experiment explores the Electrical Comparator, a precise instrument used in Metrology for comparing object dimensions against a standard.',
        imagePath: 'images/experiment/electricalcomparator.jpg',
        link: 'electrical-comparator/'
    },
    {
        id: 'exp-12',
        subject: 'Metrology',
        title: 'Mechanical Comparator',
        description: 'Compares workpiece dimensions against a standard, measuring small differences in mechanical components.',
        imagePath: 'images/experiment/mechanicalcomparator.jpg',
        link: 'mechanical-comparator/'
    },
    {
        id: 'exp-13',
        subject: 'Metrology',
        title: 'Sine Bar Experiment',
        description: 'Utilizes a sine bar to measure angles and slopes with high precision in engineering applications.',
        imagePath: 'images/experiment/sinebar.jpg',
        link: 'sine-bar/'
    },
    {
        id: 'exp-14',
        subject: 'Metrology',
        title: 'Pnuematic Comparator',
        description: 'Measures small dimensional differences using air pressure variations for high-precision comparisons.',
        imagePath: 'images/experiment/pnuematiccomparator.jpg',
        link: 'pneumatic-comparator/'
    },
    {
        id: 'exp-1',
        subject: 'EDrawing',
        title: 'Conic Section-Parabola',
        description: 'Study of the properties and construction of parabolic curves in engineering graphics.',
        imagePath: 'images/experiment/parabola.png',
        link: 'parabola/'
    },
    {
        id: 'exp-2',
        subject: 'EDrawing',
        title: 'Conic Section-Hyperbola',
        description: 'Study of the properties and construction of hyperbolic curves in engineering graphics.',
        imagePath: 'images/experiment/parabola.png',
        link: 'hyperbola/'
    },
    {
        id: 'exp-3',
        subject: 'EDrawing',
        title: 'Conic Sections: Ellipse',
        description: 'To Construct an ellipse given the distance of the focus from the directrix as 60mm and eccentricity as 2/3.',
        imagePath: 'images/experiment/ellipse.png',
        link: 'ellipse/'
    },
    {
        id: 'exp-4',
        subject: 'EDrawing',
        title: 'Conic Sections: Epicycloid',
        description: 'To cosntruct a Epicycloid, given that the radius of main circle is four times the radius of revolving circle.',
        imagePath: 'images/experiments/epicycloid.png',
        link: 'epicycloid/'
    },
    {
        id: 'exp-5',
        subject: 'EDrawing',
        title: 'Conic Sections: Hypocycloid',
        description: 'To cosntruct a Hypocycloid, given that the radius of main circle is four times the radius of revolving circle.',
        imagePath: 'images/experiments/hypocycloid.png',
        link: 'hypocycloid/'
    },
    {
        id: 'exp-6',
        subject: 'EDrawing',
        title: 'Conic Sections: Polygon Involute',
        description: 'To cosntruct a involute of any polygon as per Engineering Drawing standards.',
        imagePath: 'images/experiments/polyInvolute.png',
        link: 'polyInvolute/'
    },
    {
        id: 'exp-7',
        subject: 'EDrawing',
        title: 'Conic Sections: Circle Involute',
        description: 'To cosntruct a involute of a circle as per Engineering Drawing standards.',
        imagePath: 'images/experiments/circleInvolute.png',
        link: 'circleInvolute/'
    },
    {
        id: 'exp-8',
        subject: 'EDrawing',
        title: 'Projection Of Points',
        description: 'To understand the position and to draw the projection of a point in four quadrants.',
        imagePath: 'images/experiments/projPoints.png',
        link: 'projPoints/'
    },
    {
        id: 'exp-9',
        subject: 'EDrawing',
        title: 'Projection Of Lines: Inclined to VP',
        description: 'To draw the projection a line of length 40mm located 20mm above HP, 15mm infront of VP and inclined at an angle of 35° to VP.',
        imagePath: 'images/experiments/lineProj1.png',
        link: 'lineProj1/'
    },
    {
        id: 'exp-10',
        subject: 'EDrawing',
        title: 'Projection Of Lines: Inclined to VP and HP',
        description: 'To draw the projection a line inclined to both VP and HP (General).',
        imagePath: 'images/experiments/linesVPHP.png',
        link: 'linesVPHP/'
    },
    {
        id: 'exp-11',
        subject: 'EDrawing',
        title: 'Projection Of Planes: Hexagonal, Pentagonal & Square Planes',
        description: 'To draw the projection of planes whose surface is inclined at an angle 45° to HP and side is resting on HP, inclined at an angle 60° to VP.',
        imagePath: 'images/experiments/planes.png',
        link: 'planes/'
    },
    {
        id: 'exp-12',
        subject: 'EDrawing',
        title: 'Projection Of Solids: Pentagonal Prism',
        description: "To draw the top view and front view of a pentagonal prism of side 30 mm and height 70 mm is above HP with one of it's rectangular face parallel to HP and the axis is perpendicular to VP.",
        imagePath: 'images/experiments/pentPrism.png',
        link: 'pentPrism/'
    },
    {
        id: 'exp-13',
        subject: 'EDrawing',
        title: 'Projection Of Solids: Hexagonal Prism',
        description: "To draw the top view and front view of the Hexagonal Prism of side 30 mm and height 70 mm is above HP with two of it's rectangular face parallel to HP and the axis is perpendicular to VP.",
        imagePath: 'images/experiments/hexPrism.png',
        link: 'hexPrism/'
    },
    {
        id: 'exp-14',
        subject: 'EDrawing',
        title: 'Projection of Solids: Hexagonal Prism',
        description: 'To draw the front view and top view of a hexagonal pyramid of base side 30mm and length 70mm, inclined to VP at an angle of 45°.',
        imagePath: 'images/experiments/prismIncVP.png',
        link: 'prismIncVP/'
    },
    {
        id: 'exp-15',
        subject: 'EDrawing',
        title: 'Projection of Solids: Hexagonal Pyramid - Inclined to HP',
        description: 'To draw the projection of a hexagonal pyramid of base 30 mm and axis height 60 mm lying on HP with one of its side edges and the surface is inclined at an angle 60° to the HP.',
        imagePath: 'images/experiments/hexPyramid2.png',
        link: 'hexPyramid2/'
    },
    {
        id: 'exp-16',
        subject: 'EDrawing',
        title: 'Projection of Solids: Hexagonal Pyramid',
        description: 'To draw the projection of a hexagonal pyramid of base 30 mm and axis height 60 mm lies on one of its side edges and is inclined at 60° to HP and 45° to VP.',
        imagePath: 'images/experiments/hexPyVPHP.png',
        link: 'hexPyVPHP/'
    },
    {
        id: 'exp-17',
        subject: 'EDrawing',
        title: 'Section of Solids: Pyramid',
        description: 'To draw the front view, top view and sectioned view of solid pyramid with given dimensions and cutting plane angle.',
        imagePath: 'images/experiments/sectionPyramid.png',
        link: 'sectionPyramid/'
    },
    {
        id: 'exp-18',
        subject: 'EDrawing',
        title: 'Section Of Solids: Prism Inclined to HP',
        description: 'To draw the true shape of sectioned surface, front view and top view of a pentagonal prism which is sectioned by a cutting plane inclined at an angle 30° to HP and 25mm above the base.',
        imagePath: 'images/experiments/sectionPentPrism.png',
        link: 'sectionPentPrism/'
    },
    {
        id: 'exp-19',
        subject: 'EDrawing',
        title: 'Section Of Solids: Prism Inclined to VP',
        description: 'To draw the true shape of sectioned surface, front view and top view of a pentagonal prism which is sectioned by a cutting plane inclined at an angle 30° to VP and 25mm infront of VP.',
        imagePath: 'images/experiments/sectionIncVP.png',
        link: 'sectionIncVP/'
    },
    {
        id: 'exp-20',
        subject: 'EDrawing',
        title: 'Section of Solids: Hexagonal Pyramid',
        description: 'To Draw the top view, sectional front view and true shape of the section of a hexagonal pyramid of base of side 35mm and altitude 70mm rests on its base on the VP with two edges of the base parallel to HP. Given that a cutting plane parallel to VP and inclined to 35 degree with respect to HP cuts the pyramid at the height of 5mm from the centre.',
        imagePath: 'images/experiments/sectionHexPyramid.png',
        link: 'sectionHexPyramid/'
    },
    {
        id: 'exp-21',
        subject: 'EDrawing',
        title: 'Development Of Solids: Cylinder & Hexagonal Prism',
        description: 'To draw the simple projection and develop the surface of Cylinder and Hexagonal Prism whose base is resting on HP.',
        imagePath: 'images/experiments/devPrism.png',
        link: 'devPrism/'
    },
    {
        id: 'exp-22',
        subject: 'EDrawing',
        title: 'Development Of Solids: Pentagonal Pyramid',
        description: 'To draw the simple projection and develop the surface of a pentagonal pyramid of height 40 mm and base edge of 30 mm is resting on HP with its base such that one of its base edge is parallel to VP.',
        imagePath: 'images/experiments/devPyramid.png',
        link: 'devPyramid/'
    },
    {
        id: 'exp-23',
        subject: 'EDrawing',
        title: 'Development Of Solids: Pentagonal Prism',
        description: 'To draw the simple projection and develop the surface of a pentagonal prism of height 40 mm and base edge of 30 mm is resting on HP with its base such that one of its base edge is parallel to VP.',
        imagePath: 'images/experiments/devPentPrism.png',
        link: 'devPentPrism/'
    },
    {
        id: 'exp-24',
        subject: 'EDrawing',
        title: 'Isometric Projection: Square Prism',
        description: 'To draw the isometric projection of a square prism of height 70mm and the base is resting on HP with side length of 30mm.',
        imagePath: 'images/experiments/sqrPrismIso.png',
        link: 'sqrPrismIso/'
    }

    
];

export default EXPERIMENTS;
