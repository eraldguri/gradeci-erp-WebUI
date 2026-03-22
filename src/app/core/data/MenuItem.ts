interface MenuItem {
    label: string;
    icon?: string;
    active?: boolean;
    expanded?: boolean;
    children?: ChildItem[];
    route?: string;
    menuType: 'sidenav' | 'navbar'
}

interface ChildItem {
    label: string;
    icon?: string;
    active?: boolean;
    route?: string;
}