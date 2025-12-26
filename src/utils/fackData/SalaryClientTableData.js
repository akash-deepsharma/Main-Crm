// import { projectStatusOptions, taskAssigneeOptions } from '@/utils/options';

import { ClientAttandaceStatusOptions, taskAssigneeOptions } from "../options"

const status = ClientAttandaceStatusOptions
const assigned = taskAssigneeOptions

export const SalaryClientTableData = [
    {
        "id": 1,
        "project-name": {
            "title": "Spark: This name could work well for a project related to innovation, creativity, or inspiration.",
            "img": "/images/brand/app-store.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Alexandra Della",
            "img": "/images/avatar/1.png"
        },
        "phone": "9876543210",
        "email": "alexandra@gmail.com",
        "organisation": "National Security Guard (NSG)",
        "ministry": "Ministry of Home Affairs",
        "assigned": { assigned, defaultSelect: 'arcie.tones@gmail.com' },
        "status": { defaultSelect: 'Updated', color:'success' },
        "aname": { status, defaultSelect: 'in-projress' }
    },
    {
        "id": 2,
        "project-name": {
            "title": "Nexus: This name could work well for a project related to connectivity, bringing different people or ideas together, or solving complex problems.",
            "img": "/images/brand/dropbox.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Green Cute",
            "img": "/images/avatar/2.png"
        },
        "phone": "9876543210",
        "email": "alexandra@gmail.com",
        "organisation": "National Security Guard (NSG)",
        "ministry": "Ministry of Home Affairs",
        "assigned": { assigned, defaultSelect: 'jon.tones@gmail.com' },
        "status": { defaultSelect: 'Not Updated', color:'danger' }
    },
    {
        "id": 3,
        "project-name": {
            "title": "Nexus: This name could work well for a project related to connectivity, bringing different people or ideas together, or solving complex problems.",
            "img": "/images/brand/dropbox.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Green Cute",
            "img": "/images/avatar/2.png"
        },
        "phone": "9876543210",
        "email": "alexandra@gmail.com",
        "organisation": "National Security Guard (NSG)",
        "ministry": "Ministry of Home Affairs",
        "assigned": { assigned, defaultSelect: 'jon.tones@gmail.com' },
        "status": { defaultSelect: 'Not Updated', color:'danger' }
    },

]