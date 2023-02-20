import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { StockMarketDetailContext, ScanItem, ScanCriteriaItem, ValueVariable, IndicatorVariable } from '@/layout/main-layout';

import styles from '@/styles/common.module.css';

type propsCriteriaItem = {
    scanId: ScanItem['id'];
    criteria: ScanCriteriaItem;
};
function CriteriaItem({ scanId, criteria }: propsCriteriaItem) {
    const text = criteria.text;
    let textHTML = (<span>{text}</span>);
    if (criteria.type == "variable") {
        const var_keys = text.match(/(\$[0-9]{1})/g) as string[] || [];
        const var_vals = var_keys.reduce((acc: Record<string, string | number>, curr: string) => {
            if (criteria.variable && curr in criteria.variable) {
                if (criteria.variable[curr].type == 'value') {
                    acc[curr] = (criteria.variable[curr] as ValueVariable).values[0];
                } else if (criteria.variable[curr].type == 'indicator') {
                    acc[curr] = (criteria.variable[curr] as IndicatorVariable).default_value;
                }
            }
            return acc;
        }, {})
        textHTML = (
            <span>
                {text.split(/(\$[0-9]{1})/g).map((subStr) => {
                    if (subStr in var_vals) {
                        const url = `/details/${scanId}/variable/${subStr}`;
                        return (
                            <Link key={`url`} href={url} >
                                {var_vals[subStr]}
                            </Link>
                        );
                    }
                    return subStr;
                })}
            </span>
        );
    }
    return (
        <li className="flex py-4">
            <p className={`font-medium text-gray-900 ${styles['variable-text']}`}>
                {textHTML}
            </p>
        </li>
    );
}

export default function ScanCriteria() {
    const router = useRouter()
    const { scanID } = router.query;

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="w-screen h-screen flex flex-col items-center justify-center border-t border-gray-200 bg-gray-100  px-4 py-3 sm:px-6" >
                <div className='flex flex-col overflow-hidden mx-auto max-w-lg md:min-w-[30vw]' >
                    <button className="inline-flex gap-2 items-center my-3" onClick={() => { router.push("/"); }} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
                        </svg>
                        Go back
                    </button>
                    <StockMarketDetailContext.Consumer>
                        {(details) => {
                            const scan = typeof scanID == 'string' ? details.find((item) => (item.id == parseInt(scanID))) : undefined;
                            console.log("ScanCriteria", scan);
                            return (
                                <div className='overflow-hidden bg-white shadow sm:rounded-md mx-auto max-w-lg md:min-w-[30vw] px-4 py-5 sm:px-4' >
                                    {scan ? (
                                        <>
                                            <h3 className="text-2xl font-medium leading-6 text-gray-900">
                                                {scan.name}
                                            </h3>
                                            <div className="mt-3 flex flex-shrink-0">
                                                <p className={styles[`tag-${scan.color}`]} >
                                                    {scan.tag}
                                                </p>
                                            </div>
                                            <hr className="w-full border-[0.1px] border-gray-200 mt-5" />
                                            <ul role="list" className='divide-y divide-gray-200' >
                                                {scan.criteria.map((criteria) => (
                                                    <CriteriaItem
                                                        key={`${scan.id}_${criteria.text}`}
                                                        scanId={scan.id}
                                                        criteria={criteria}
                                                    />
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <h3 className="text-2xl font-medium leading-6 text-gray-900">Scan not found.</h3>
                                    )}
                                </div>
                            );
                        }}
                    </StockMarketDetailContext.Consumer>
                </div>
            </main>
        </>
    )
}
