import { useId } from 'react'
import { LayoutGrid } from 'lucide-react'
import './BudgetFilterEmpty.css'

function BudgetEnvelopeArt({ over, id }) {
  const ink = over ? '#97ad85' : '#b99a69'
  return (
    <svg
      className="category-empty-art"
      viewBox="0 0 180 144"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-paper`}
          x1="46"
          y1="71"
          x2="119"
          y2="121"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={over ? '#f7fbef' : '#fff9eb'} />
          <stop offset="1" stopColor={over ? '#dfebcf' : '#f6e4bf'} />
        </linearGradient>
      </defs>
      <path
        d="M27 73c-8-25 12-49 37-46 17-16 46-12 57 4 30-3 46 23 33 47 7 22-12 46-37 44H58c-27 7-46-21-31-49Z"
        fill={over ? '#eef4e8' : '#f8f0e1'}
      />
      <circle cx="131" cy="43" r="23" fill="#f0e6f8" />
      <ellipse cx="89" cy="132" rx="65" ry="3.5" fill={over ? '#b3c4a7' : '#cfb88d'} opacity=".2" />
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g className="budget-empty-envelope">
          <g transform="rotate(-7 81 58)">
            <rect x="52" y="28" width="55" height="73" rx="5" fill="#fffcf4" stroke="#c5aed2" />
            <path d="M58 35h43v58H58z" stroke="#e2d3e9" strokeDasharray="1.5 3" />
            <path d="M64 43h29m-29 7h21m-21 25h29m-29 7h18" stroke="#d9c6e2" />
            <path d="M76 58c-3-4-8 1-3 5l4 3 4-4c4-4-2-8-5-4Z" fill="#edcedc" stroke="#c89eb5" />
          </g>
          <rect
            x="35"
            y="68"
            width="94"
            height="55"
            rx="9"
            fill={`url(#${id}-paper)`}
            stroke={ink}
          />
          <path
            d="m36 75 37 24a17 17 0 0 0 19 0l36-24"
            fill={over ? '#f5faed' : '#fff5db'}
            stroke={ink}
          />
          <path d="m39 118 20-21m66 21-19-21" stroke={over ? '#c4d5b4' : '#dfc79e'} />
          <path
            d="M41 82v29c0 4 2 6 6 6h13m47 0h10c4 0 6-2 6-6V82"
            stroke={over ? '#bfd0ac' : '#ddc69e'}
            strokeDasharray="2 3"
          />
          <rect
            x="61"
            y="100"
            width="42"
            height="18"
            rx="6"
            fill="#fffdf6"
            stroke={over ? '#c7d7b7' : '#e1cda7'}
          />
          <path
            d="M74 107q1.5-2 3 0m10 0q1.5-2 3 0m-12 6q3 3 6 0"
            stroke={over ? '#7f976d' : '#aa8b59'}
          />
          <path d="M69 111h3m20 0h3" stroke="#e7bbc7" strokeWidth="2.8" />
        </g>
        {over ? (
          <g className="budget-empty-shield">
            <path
              d="m131 42 20 8v17c0 14-11 22-20 25-9-3-20-11-20-25V50l20-8Z"
              fill="#f9fcf4"
              stroke="#97ad85"
              strokeWidth="1.7"
            />
            <path
              d="m131 48 14 6v13c0 10-7 17-14 20-7-3-14-10-14-20V54l14-6Z"
              stroke="#c4d5b4"
              strokeDasharray="2 3"
            />
            <path d="m122 67 6 6 13-16" stroke="#85a477" strokeWidth="2.5" />
            <path d="M121 55h.1m21 24h.1" stroke="#d4c0e2" strokeWidth="3" />
          </g>
        ) : (
          <>
            <circle cx="133" cy="65" r="23" fill="#fffdf7" stroke="#b59ac7" strokeWidth="1.7" />
            <circle cx="133" cy="65" r="18" stroke="#e7d9ee" strokeDasharray="1 3" />
            <path d="M120 69a14 14 0 0 1 26 0" stroke="#ecdbb6" strokeWidth="4" />
            <path d="M123 57l2 2m8-8v3m10 3-2 2" stroke="#bca2ce" />
            <g className="budget-empty-needle">
              <path d="m133 67-6-9" stroke="#b1935f" strokeWidth="2.2" />
              <circle cx="133" cy="67" r="3" fill="#f4ddb0" stroke="#b1935f" />
            </g>
            <path d="M127 76h12" stroke="#dbcae5" />
          </>
        )}
        <path
          d="M152 125v-18m0 9c-9 0-13-6-10-10 5-2 10 6 10 10Zm1-7c0-8 7-13 11-9 2 5-5 9-11 9Z"
          fill="#d5e5cb"
          stroke="#9ab08b"
        />
        <path
          d="m26 40 1.5 4.5L32 46l-4.5 1.5L26 52l-1.5-4.5L20 46l4.5-1.5L26 40Z"
          fill="#ffe7b0"
          stroke="#c9aa74"
        />
        <path d="m155 27 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="#e2d0ed" stroke="#b99aca" />
        <path d="M36 94c-3-4-8 1-3 5l4 3 3-3c4-4-1-8-4-5Z" fill="#edcddd" stroke="#c59eb5" />
        <circle cx="44" cy="24" r="2" fill="#c9b1dc" stroke="none" />
      </g>
    </svg>
  )
}

export default function BudgetFilterEmpty({ filter, onShowAll }) {
  const id = useId().replaceAll(':', '')
  const over = filter === 'over'
  return (
    <section className={`category-budget-empty is-${filter}`} aria-labelledby={`${id}-title`}>
      <BudgetEnvelopeArt over={over} id={id} />
      <div className="category-budget-empty-copy">
        <h3 id={`${id}-title`}>{over ? 'Chưa có mục vượt hạn mức' : 'Chưa có mục gần hạn mức'}</h3>
        <p>
          {over
            ? 'Danh mục chi quá hạn mức sẽ xuất hiện ở đây.'
            : 'Danh mục dùng 80–100% hạn mức sẽ hiện ở đây.'}
        </p>
        <button className="button primary" type="button" onClick={onShowAll}>
          <LayoutGrid size={14} aria-hidden="true" /> Xem tất cả danh mục
        </button>
      </div>
    </section>
  )
}
