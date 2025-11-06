"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Helper to format titles
function toTitleCase(str: string) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function breadcrumbs() {
  const pathname = usePathname() || "/"
  const segments = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex flex-wrap items-center gap-1.5 text-base font-medium">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/asset" className="text-base font-medium">
              Asset
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/")
          const isLast = index === segments.length - 1
          const title = toTitleCase(segment)

          if (index === 0 && segment === "asset") return null

          return (
            <Fragment key={href}>
              <BreadcrumbSeparator className="text-base" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-base font-medium">{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="text-base font-medium">
                      {title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
